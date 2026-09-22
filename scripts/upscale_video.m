#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <CoreImage/CoreImage.h>

static void fail(NSString *message, NSError *error) {
  fprintf(stderr, "%s%s\n", message.UTF8String, error ? [[@": " stringByAppendingString:error.localizedDescription] UTF8String] : "");
  exit(1);
}

int main(int argc, const char *argv[]) {
  @autoreleasepool {
    if (argc < 3 || argc > 6) fail(@"Usage: upscale_video input output [width height codec]", nil);

    int outputWidth = argc >= 4 ? atoi(argv[3]) : 7680;
    int outputHeight = argc >= 5 ? atoi(argv[4]) : 4320;
    BOOL useH264 = argc >= 6 && strcmp(argv[5], "h264") == 0;

    NSURL *sourceURL = [NSURL fileURLWithPath:[NSString stringWithUTF8String:argv[1]]];
    NSURL *outputURL = [NSURL fileURLWithPath:[NSString stringWithUTF8String:argv[2]]];
    [[NSFileManager defaultManager] removeItemAtURL:outputURL error:nil];

    AVURLAsset *asset = [AVURLAsset URLAssetWithURL:sourceURL options:nil];
    AVAssetTrack *track = [[asset tracksWithMediaType:AVMediaTypeVideo] firstObject];
    if (!track) fail(@"No video track found", nil);

    NSError *error = nil;
    AVAssetReader *reader = [[AVAssetReader alloc] initWithAsset:asset error:&error];
    if (!reader) fail(@"Could not create video reader", error);

    NSDictionary *readerSettings = @{
      (NSString *)kCVPixelBufferPixelFormatTypeKey: @(kCVPixelFormatType_32BGRA)
    };
    AVAssetReaderTrackOutput *readerOutput = [[AVAssetReaderTrackOutput alloc] initWithTrack:track outputSettings:readerSettings];
    readerOutput.alwaysCopiesSampleData = NO;
    if (![reader canAddOutput:readerOutput]) fail(@"Could not attach video reader", nil);
    [reader addOutput:readerOutput];

    AVAssetWriter *writer = [[AVAssetWriter alloc] initWithURL:outputURL fileType:AVFileTypeMPEG4 error:&error];
    if (!writer) fail(@"Could not create video writer", error);

    int averageBitRate = useH264
      ? (outputWidth >= 3840 ? 42000000 : outputWidth >= 1920 ? 18000000 : 9000000)
      : (outputWidth >= 7000 ? 56000000 : 26000000);
    NSDictionary *compression = @{
      AVVideoAverageBitRateKey: @(averageBitRate),
      AVVideoExpectedSourceFrameRateKey: @24,
      AVVideoMaxKeyFrameIntervalKey: @1,
      AVVideoAllowFrameReorderingKey: @NO,
      AVVideoProfileLevelKey: useH264
        ? (__bridge NSString *)kVTProfileLevel_H264_High_AutoLevel
        : (__bridge NSString *)kVTProfileLevel_HEVC_Main_AutoLevel
    };
    NSDictionary *writerSettings = @{
      AVVideoCodecKey: useH264 ? AVVideoCodecTypeH264 : AVVideoCodecTypeHEVC,
      AVVideoWidthKey: @(outputWidth),
      AVVideoHeightKey: @(outputHeight),
      AVVideoCompressionPropertiesKey: compression
    };
    AVAssetWriterInput *writerInput = [AVAssetWriterInput assetWriterInputWithMediaType:AVMediaTypeVideo outputSettings:writerSettings];
    writerInput.expectsMediaDataInRealTime = NO;

    NSDictionary *pixelAttributes = @{
      (NSString *)kCVPixelBufferPixelFormatTypeKey: @(kCVPixelFormatType_32BGRA),
      (NSString *)kCVPixelBufferWidthKey: @(outputWidth),
      (NSString *)kCVPixelBufferHeightKey: @(outputHeight),
      (NSString *)kCVPixelBufferIOSurfacePropertiesKey: @{}
    };
    AVAssetWriterInputPixelBufferAdaptor *adaptor = [AVAssetWriterInputPixelBufferAdaptor
      assetWriterInputPixelBufferAdaptorWithAssetWriterInput:writerInput
      sourcePixelBufferAttributes:pixelAttributes];
    if (![writer canAddInput:writerInput]) fail(@"Could not attach video writer", nil);
    [writer addInput:writerInput];

    if (![reader startReading]) fail(@"Could not start video reader", reader.error);
    if (![writer startWriting]) fail(@"Could not start video writer", writer.error);
    [writer startSessionAtSourceTime:kCMTimeZero];

    CIContext *context = [CIContext contextWithOptions:@{kCIContextUseSoftwareRenderer: @NO}];
    CGColorSpaceRef colorSpace = CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
    NSInteger frames = 0;

    while (reader.status == AVAssetReaderStatusReading) {
      @autoreleasepool {
        CMSampleBufferRef sample = [readerOutput copyNextSampleBuffer];
        if (!sample) break;
        CVPixelBufferRef sourceBuffer = CMSampleBufferGetImageBuffer(sample);
        CVPixelBufferRef destinationBuffer = nil;
        CVReturn result = CVPixelBufferPoolCreatePixelBuffer(NULL, adaptor.pixelBufferPool, &destinationBuffer);
        if (result != kCVReturnSuccess || !destinationBuffer) fail(@"Could not allocate an output frame", nil);

        CIImage *sourceImage = [CIImage imageWithCVPixelBuffer:sourceBuffer];
        CIImage *cleanImage = [sourceImage imageByApplyingFilter:@"CINoiseReduction"
          withInputParameters:@{ @"inputNoiseLevel": @0.012, @"inputSharpness": @0.48 }];
        cleanImage = [cleanImage imageByApplyingFilter:@"CIColorControls"
          withInputParameters:@{ @"inputSaturation": @0.985, @"inputContrast": @0.94, @"inputBrightness": @0.018 }];

        CGFloat scale = (CGFloat)outputWidth / CGRectGetWidth(cleanImage.extent);
        CIFilter *filter = [CIFilter filterWithName:@"CILanczosScaleTransform"];
        [filter setValue:cleanImage forKey:kCIInputImageKey];
        [filter setValue:@(scale) forKey:kCIInputScaleKey];
        [filter setValue:@1.0 forKey:kCIInputAspectRatioKey];
        CIImage *upscaledImage = [filter.outputImage imageByApplyingFilter:@"CIUnsharpMask"
          withInputParameters:@{
            @"inputRadius": @(outputWidth >= 7000 ? 2.0 : 1.25),
            @"inputIntensity": @(outputWidth >= 7000 ? 0.34 : 0.42)
          }];

        [context render:upscaledImage
        toCVPixelBuffer:destinationBuffer
                 bounds:CGRectMake(0, 0, outputWidth, outputHeight)
             colorSpace:colorSpace];

        while (!writerInput.readyForMoreMediaData) usleep(1000);
        CMTime presentationTime = CMSampleBufferGetPresentationTimeStamp(sample);
        if (![adaptor appendPixelBuffer:destinationBuffer withPresentationTime:presentationTime]) {
          CVPixelBufferRelease(destinationBuffer);
          CFRelease(sample);
          fail(@"Could not encode an output frame", writer.error);
        }

        CVPixelBufferRelease(destinationBuffer);
        CFRelease(sample);
        frames += 1;
        if (frames % 30 == 0) fprintf(stderr, "Encoded %ld frames\n", (long)frames);
      }
    }

    CGColorSpaceRelease(colorSpace);
    [writerInput markAsFinished];
    dispatch_semaphore_t finished = dispatch_semaphore_create(0);
    [writer finishWritingWithCompletionHandler:^{ dispatch_semaphore_signal(finished); }];
    dispatch_semaphore_wait(finished, DISPATCH_TIME_FOREVER);

    if (reader.status == AVAssetReaderStatusFailed) fail(@"Video reading failed", reader.error);
    if (writer.status != AVAssetWriterStatusCompleted) fail(@"Video writing failed", writer.error);
    printf("Encoded %ld frames at %dx%d\n", (long)frames, outputWidth, outputHeight);
  }
  return 0;
}

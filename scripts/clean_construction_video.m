#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <CoreImage/CoreImage.h>
#import <ImageIO/ImageIO.h>

// Compile with clang -fobjc-arc and the Foundation, AVFoundation, CoreImage,
// VideoToolbox, CoreMedia, CoreGraphics, CoreVideo, and ImageIO frameworks.
// The source construction animation is silent, 24 fps, and 1920 x 1080.

// Process the original footage once. Keep neutral concrete free of colored
// compression speckles while retaining the timber and interior warmth.
static CIImage *cleanFrame(CIImage *sourceImage, int outputWidth) {
  CGRect extent = sourceImage.extent;
  CIImage *image = [sourceImage imageByClampingToExtent];
  image = [image imageByApplyingFilter:@"CINoiseReduction"
    withInputParameters:@{ @"inputNoiseLevel": @0.027, @"inputSharpness": @0.12 }];
  image = [image imageByCroppingToRect:extent];

  static CIColorKernel *colorKernel;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    colorKernel = [CIColorKernel kernelWithString:
      @"kernel vec4 cleanChroma(__sample pixel) {"
       "  vec3 c = unpremultiply(pixel).rgb;"
       "  float y = dot(c, vec3(0.2126, 0.7152, 0.0722));"
       "  float chroma = max(max(c.r, c.g), c.b) - min(min(c.r, c.g), c.b);"
       "  float strength = mix(0.25, 1.32, smoothstep(0.025, 0.12, chroma));"
       "  return premultiply(vec4(clamp(vec3(y) + (c - vec3(y)) * strength, 0.0, 1.0), pixel.a));"
       "}"];
  });
  if (colorKernel) image = [colorKernel applyWithExtent:extent arguments:@[image]];
  image = [image imageByApplyingFilter:@"CIColorControls"
    withInputParameters:@{ @"inputSaturation": @1.0, @"inputContrast": @1.075, @"inputBrightness": @0.006 }];

  CGFloat scale = (CGFloat)outputWidth / CGRectGetWidth(extent);
  if (fabs(scale - 1.0) > 0.0001) {
    image = [image imageByApplyingFilter:@"CILanczosScaleTransform"
      withInputParameters:@{ @"inputScale": @(scale), @"inputAspectRatio": @1.0 }];
  }
  return [image imageByApplyingFilter:@"CIUnsharpMask"
    withInputParameters:@{ @"inputRadius": @0.7, @"inputIntensity": @0.12 }];
}

static void fail(NSString *message, NSError *error) {
  fprintf(stderr, "%s%s\n", message.UTF8String, error ? [[@": " stringByAppendingString:error.localizedDescription] UTF8String] : "");
  exit(1);
}

int main(int argc, const char *argv[]) {
  @autoreleasepool {
    CGColorSpaceRef colorSpace = CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
    CIContext *context = [CIContext contextWithOptions:@{
      kCIContextUseSoftwareRenderer: @NO,
      kCIContextWorkingColorSpace: (__bridge id)colorSpace
    }];
    if (argc == 4 && strcmp(argv[1], "preview") == 0) {
      NSString *inputDirectory = [NSString stringWithUTF8String:argv[2]];
      NSString *outputDirectory = [NSString stringWithUTF8String:argv[3]];
      [[NSFileManager defaultManager] createDirectoryAtPath:outputDirectory
        withIntermediateDirectories:YES attributes:nil error:nil];
      for (NSString *name in [[NSFileManager defaultManager] contentsOfDirectoryAtPath:inputDirectory error:nil]) {
        if (![name.pathExtension isEqualToString:@"png"]) continue;
        NSURL *input = [NSURL fileURLWithPath:[inputDirectory stringByAppendingPathComponent:name]];
        CIImage *image = [CIImage imageWithContentsOfURL:input];
        CIImage *cleaned = cleanFrame(image, (int)CGRectGetWidth(image.extent));
        NSURL *output = [NSURL fileURLWithPath:[outputDirectory stringByAppendingPathComponent:name]];
        NSError *error = nil;
        if (![context writePNGRepresentationOfImage:cleaned toURL:output format:kCIFormatRGBA8 colorSpace:colorSpace options:@{} error:&error]) {
          fail(@"Could not save preview", error);
        }
      }
      CGColorSpaceRelease(colorSpace);
      return 0;
    }
    if (argc < 3 || argc > 6) fail(@"Usage: clean_video input output [width height codec] | preview input-directory output-directory", nil);

    int outputWidth = argc >= 4 ? atoi(argv[3]) : 1920;
    int outputHeight = argc >= 5 ? atoi(argv[4]) : 1080;
    BOOL useH264 = argc < 6 || strcmp(argv[5], "hevc") != 0;

    NSURL *sourceURL = [NSURL fileURLWithPath:[NSString stringWithUTF8String:argv[1]]];
    NSURL *outputURL = [NSURL fileURLWithPath:[NSString stringWithUTF8String:argv[2]]];
    if ([[NSFileManager defaultManager] fileExistsAtPath:outputURL.path]) {
      fail(@"Output already exists; choose a new versioned filename", nil);
    }

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
    writer.shouldOptimizeForNetworkUse = YES;

    int averageBitRate = useH264
      ? (outputWidth >= 3840 ? 50000000 : outputWidth >= 1920 ? 30000000 : 12000000)
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
      AVVideoColorPropertiesKey: @{
        AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
        AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
        AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2
      },
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
        CIImage *upscaledImage = cleanFrame(sourceImage, outputWidth);

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

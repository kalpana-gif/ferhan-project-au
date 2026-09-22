import { useEffect, useRef, useState } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export default function ConstructionScroll() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationFrame = 0
    let targetProgress = 0
    let renderedProgress = 0
    let sectionTop = 0
    let scrollDistance = 1
    let previousFrameTime = 0
    let lastSeekTime = 0
    let isRunning = false

    const render = (timestamp) => {
      const delta = targetProgress - renderedProgress
      const elapsed = previousFrameTime ? Math.min(timestamp - previousFrameTime, 64) : 16.67
      const easing = 1 - Math.exp(-elapsed / 125)
      previousFrameTime = timestamp
      renderedProgress = reducedMotion || Math.abs(delta) < 0.0005
        ? targetProgress
        : renderedProgress + delta * easing

      if (Number.isFinite(video.duration) && video.duration > 0) {
        const targetTime = renderedProgress * Math.max(0, video.duration - 0.025)
        const frameDuration = 1 / 24
        const canSeek = !video.seeking && timestamp - lastSeekTime >= 38
        if (canSeek && Math.abs(video.currentTime - targetTime) > frameDuration * 0.55) {
          video.currentTime = targetTime
          lastSeekTime = timestamp
        }
      }

      if (Math.abs(targetProgress - renderedProgress) >= 0.0005) {
        animationFrame = requestAnimationFrame(render)
      } else {
        renderedProgress = targetProgress
        previousFrameTime = 0
        isRunning = false
      }
    }

    const updateTarget = () => {
      targetProgress = clamp((window.scrollY - sectionTop) / scrollDistance, 0, 1)

      if (!isRunning) {
        isRunning = true
        animationFrame = requestAnimationFrame(render)
      }
    }

    const measure = () => {
      sectionTop = section.offsetTop
      scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight)
      updateTarget()
    }

    const handleMetadata = () => {
      video.pause()
      setIsReady(true)
      measure()
    }

    video.addEventListener('loadedmetadata', handleMetadata)
    video.addEventListener('seeked', updateTarget)
    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', measure)

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(section)

    if (video.readyState >= 1) handleMetadata()
    else measure()

    return () => {
      cancelAnimationFrame(animationFrame)
      video.removeEventListener('loadedmetadata', handleMetadata)
      video.removeEventListener('seeked', updateTarget)
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', measure)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`construction-scroll ${isReady ? 'is-ready' : ''}`}
      aria-label="Scroll-controlled house construction animation"
    >
      <div className="construction-scroll__stage">
        <video
          ref={videoRef}
          className="construction-scroll__video"
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
          aria-hidden="true"
        >
          <source src="/assets/modern-house-construction-enhanced-8k.mp4" type='video/mp4; codecs="hvc1"' media="(min-width: 1200px)" />
          <source src="/assets/modern-house-construction-enhanced-4k.mp4" type='video/mp4; codecs="avc1.640033"' media="(min-width: 768px)" />
          <source src="/assets/modern-house-construction-enhanced-1080.mp4" type='video/mp4; codecs="avc1.640033"' />
          <source src="/assets/modern-house-construction.mp4" type="video/mp4" />
        </video>

        <p className="sr-only">Scrolling through this section controls a video showing a modern house being assembled from the ground up.</p>
      </div>
    </section>
  )
}

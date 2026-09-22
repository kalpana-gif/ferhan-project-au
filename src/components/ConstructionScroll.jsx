import { useEffect, useRef, useState } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export default function ConstructionScroll() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '200% 0px' },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shouldLoad) return undefined

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
      const easing = 1 - Math.exp(-elapsed / 80)
      previousFrameTime = timestamp
      renderedProgress = reducedMotion || Math.abs(delta) < 0.0005
        ? targetProgress
        : renderedProgress + delta * easing

      if (Number.isFinite(video.duration) && video.duration > 0) {
        const targetTime = renderedProgress * Math.max(0, video.duration - 0.025)
        const frameDuration = 1 / 24
        const canSeek = !video.seeking && timestamp - lastSeekTime >= 30
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
      if (reducedMotion) {
        targetProgress = 0
        renderedProgress = 0
        return
      }

      targetProgress = clamp((window.scrollY - sectionTop) / scrollDistance, 0, 1)

      if (!isRunning) {
        isRunning = true
        animationFrame = requestAnimationFrame(render)
      }
    }

    const measure = () => {
      sectionTop = section.getBoundingClientRect().top + window.scrollY
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

    video.load()
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
  }, [shouldLoad])

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
          preload={shouldLoad ? 'auto' : 'none'}
          muted
          playsInline
          disablePictureInPicture
          aria-hidden="true"
        >
          {shouldLoad && (
            <>
              <source src="/assets/construction-scroll-720-v1.mp4" type="video/mp4" media="(max-width: 767px)" />
              <source src="/assets/construction-scroll-1080-v1.mp4" type="video/mp4" />
            </>
          )}
        </video>

        <p className="sr-only">Scrolling through this section controls a video showing a modern house being assembled from the ground up.</p>
      </div>
    </section>
  )
}

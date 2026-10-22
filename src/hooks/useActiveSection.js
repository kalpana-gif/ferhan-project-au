import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Keeps scroll-driven navigation in one place. A programmatic navigation locks
 * the visible state until scrolling settles at its destination,
 * preventing intermediate sections from briefly becoming active.
 */
export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0])
  const pendingTarget = useRef(null)

  useEffect(() => {
    let frame = null
    let settleTimer = null
    const update = () => {
      frame = null
      if (pendingTarget.current) return

      // Track section starts rather than intersection ratios: tall sections and
      // the main wrapper can span several viewports without crossing a threshold.
      const focalLine = window.innerHeight * 0.22
      let current = sectionIds[0]
      sectionIds.forEach((id) => {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= focalLine) current = id
      })
      setActiveSection(current)
    }
    const scheduleUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }
    const settle = () => {
      pendingTarget.current = null
      scheduleUpdate()
    }
    const onScroll = () => {
      scheduleUpdate()
      clearTimeout(settleTimer)
      settleTimer = setTimeout(settle, 150)
    }
    const onKeyDown = (event) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) settle()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('wheel', settle, { passive: true })
    window.addEventListener('touchstart', settle, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(document.body)
    scheduleUpdate()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('wheel', settle)
      window.removeEventListener('touchstart', settle)
      window.removeEventListener('keydown', onKeyDown)
      resizeObserver.disconnect()
      if (frame !== null) cancelAnimationFrame(frame)
      clearTimeout(settleTimer)
      pendingTarget.current = null
    }
  }, [sectionIds])

  const navigateTo = useCallback((id) => {
    const target = document.getElementById(id)
    if (!target) return

    const scrollMargin = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0
    const destination = Math.max(0, Math.min(
      window.scrollY + target.getBoundingClientRect().top - scrollMargin,
      document.documentElement.scrollHeight - window.innerHeight,
    ))
    pendingTarget.current = Math.abs(window.scrollY - destination) > 1 ? id : null
    setActiveSection(id)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
  }, [])

  return { activeSection, navigateTo }
}

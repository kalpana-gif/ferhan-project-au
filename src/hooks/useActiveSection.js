import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Keeps scroll-driven navigation in one place. A programmatic navigation locks
 * the visible state until its destination enters the observer's focal area,
 * preventing intermediate sections from briefly becoming active.
 */
export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0])
  const pendingTarget = useRef(null)

  useEffect(() => {
    const visibility = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibility.set(entry.target.id, entry.intersectionRatio)
          else visibility.delete(entry.target.id)
        })

        const pending = pendingTarget.current
        if (pending) {
          if (visibility.has(pending)) {
            pendingTarget.current = null
            setActiveSection(pending)
          }
          return
        }

        const visible = [...visibility.entries()].sort(([, a], [, b]) => b - a)
        if (visible[0]) setActiveSection(visible[0][0])
      },
      {
        rootMargin: '-22% 0px -48% 0px',
        threshold: [0.01, 0.2, 0.4, 0.6, 0.8],
      },
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sectionIds])

  const navigateTo = useCallback((id) => {
    const target = document.getElementById(id)
    if (!target) return

    pendingTarget.current = id
    setActiveSection(id)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
  }, [])

  return { activeSection, navigateTo }
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Pause, Play, Quote } from 'lucide-react'
import { testimonials } from '../../data/testimonials'
import { showPreviewContent } from '../../data/projects'
import './TestimonialsSection.css'

export default function TestimonialsSection() {
  const entries = testimonials.filter(item => item.approved || showPreviewContent)
  const trackRef = useRef(null)
  const sectionRef = useRef(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [pageVisible, setPageVisible] = useState(!document.hidden)

  const goTo = useCallback((index) => {
    const track = trackRef.current
    const target = track?.children[index]
    if (!target) return
    track.scrollTo({ left: target.offsetLeft - track.children[0].offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }, [])
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(preference.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    updateMotion()
    preference.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [entries.length])
  const rotating = entries.length > 1 && !paused && !hovered && !focused && visible && pageVisible && !reducedMotion
  useEffect(() => {
    if (!rotating) return
    const timer = window.setTimeout(() => goTo((active + 1) % entries.length), 5000)
    return () => window.clearTimeout(timer)
  }, [active, entries.length, goTo, rotating])
  if (!entries.length) return null
  function onScroll() {
    const track = trackRef.current
    const offset = track.children[0].offsetLeft
    const nearest = [...track.children].reduce((best, card, index) => Math.abs(card.offsetLeft - offset - track.scrollLeft) < Math.abs(track.children[best].offsetLeft - offset - track.scrollLeft) ? index : best, 0)
    setActive(nearest)
  }
  return <section ref={sectionRef} className="testimonials-section" aria-labelledby="testimonials-title" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
  }}>
    <div className="testimonials-shell">
      <div className="testimonials-heading"><p>Client perspectives</p><h2 id="testimonials-title">A shared vision.<br />In their words.</h2><div className="testimonials-controls"><button onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous testimonial"><ArrowLeft size={20} /></button><button onClick={() => goTo(active + 1)} disabled={active === entries.length - 1} aria-label="Next testimonial"><ArrowRight size={20} /></button></div></div>
      <div className="testimonials-track" ref={trackRef} onScroll={onScroll} tabIndex={0} aria-label="Testimonials. Swipe or use the arrow keys to browse." onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        goTo(event.key === 'Home' ? 0 : event.key === 'End' ? entries.length - 1 : Math.max(0, Math.min(entries.length - 1, active + (event.key === 'ArrowRight' ? 1 : -1))))
      }}>
        {entries.map((item, index) => <article key={item.id} className="testimonial-card" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${entries.length}`}><Quote className="testimonial-quote-icon" size={28} aria-hidden="true" /><blockquote>{item.quote}</blockquote><div className="testimonial-attribution"><span>{item.author}</span><span>{item.context}</span></div></article>)}
      </div>
      <div className="testimonials-pagination"><span aria-live={rotating ? 'off' : 'polite'} aria-atomic="true">{String(active + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}</span><div>{entries.map((item, index) => <button key={item.id} className={index === active ? 'is-active' : ''} onClick={() => goTo(index)} aria-label={`Go to testimonial ${index + 1}`} aria-current={index === active ? 'true' : undefined} />)}</div>{!reducedMotion && entries.length > 1 ? <button className="testimonials-autoplay" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Resume automatic testimonials' : 'Pause automatic testimonials'}>{paused ? 'Resume' : 'Pause'}{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button> : <span>Swipe to explore</span>}</div>
    </div>
  </section>
}

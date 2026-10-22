import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Mail, Phone, MapPin, X } from 'lucide-react'
import { dialog, overlay } from '../../animations/variants'
import { useModalA11y } from '../../hooks/useModalA11y'
import PlaneButton from '../shared/PlaneButton'
import { slides } from '../../data/slides'
import './ContactDialog.css'

const studio = {
  label: 'Architects',
  image: '/assets/gallery-exterior-day.jpg',
  alt: 'Contemporary residence with landscaped outdoor spaces',
  services: slides.filter(item => item.group === 'Services').map(item => ({ id: item.id, title: `${item.title} — ${item.eyebrow}` })),
}
const email = 'cf@ferhandesign.com.au'

export default function ContactDialog({ isOpen, onClose, category = studio, selected }) {
  const [service, setService] = useState(selected?.title || '')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const dialogRef = useRef(null)
  const submissionRef = useRef(null)
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  const close = () => {
    submissionRef.current?.abort()
    onClose()
  }
  useModalA11y(isOpen, dialogRef, close)
  useEffect(() => {
    if (isOpen) { setService(selected?.title || ''); setStatus('idle'); setError('') }
    else submissionRef.current?.abort()
  }, [isOpen, selected?.title])
  useEffect(() => () => submissionRef.current?.abort(), [])

  async function submit(event) {
    event.preventDefault()
    if (status === 'sending') return
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const payload = new FormData(form)
    setError('')
    if (isLocal) {
      const body = [...payload.entries()].filter(([key]) => !['form-name', 'bot-field'].includes(key)).map(([key, value]) => `${key}: ${value}`).join('\n')
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Ferhan ${category.label} enquiry`)}&body=${encodeURIComponent(body)}`
      setStatus('email')
      return
    }
    setStatus('sending')
    const controller = new AbortController()
    submissionRef.current = controller
    try {
      const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(payload).toString(), signal: controller.signal })
      if (!response.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch (failure) {
      if (failure.name === 'AbortError') return
      setStatus('idle')
      setError('We couldn’t send your enquiry. Please try again, or email the studio directly.')
    }
  }

  return <AnimatePresence>{isOpen && <motion.div className="dialog-backdrop enquiry-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && close()} variants={overlay} initial="hidden" animate="visible" exit="exit">
    <motion.section ref={dialogRef} className="enquiry-dialog" role="dialog" aria-modal="true" aria-labelledby="enquiry-title" aria-describedby="enquiry-description" variants={dialog} initial="hidden" animate="visible" exit="exit">
      <button className="enquiry-close" type="button" onClick={close} data-modal-autofocus aria-label="Close enquiry"><X size={20} /></button>
      <aside className="enquiry-story">
        <img src={category.image} alt={category.alt} />
        <div className="enquiry-story__content">
          <p className="enquiry-eyebrow">Ferhan / {category.label}</p>
          <h2 id="enquiry-title">Good things start with a conversation.</h2>
          <p id="enquiry-description">Share your ideas, your questions and where you’d like to go. We’ll help you find the next step.</p>
          <div className="enquiry-details">
            <a href={`mailto:${email}`}><Mail size={16} /><span>{email}</span></a>
            <a href="tel:+61402427059"><Phone size={16} /><span>+61 (0) 402 427 059</span></a>
            <a href="https://www.google.com/maps/search/?api=1&query=205A%20Wharf%20Street%20Queens%20Park%20WA%206107" target="_blank" rel="noreferrer"><MapPin size={16} /><span>205A Wharf Street<br />Queens Park WA 6107</span><ArrowUpRight size={14} /><span className="sr-only">(opens in a new tab)</span></a>
          </div>
        </div>
        <span className="enquiry-story__location">Perth, Western Australia · Since 2007</span>
      </aside>
      <div className="enquiry-panel">
        {['success', 'email'].includes(status) ? <div className="enquiry-success" role="status" aria-live="polite">
          <span className="enquiry-success__icon"><Check size={28} /></span>
          <p className="enquiry-eyebrow">{status === 'email' ? 'One more step' : 'Enquiry received'}</p>
          <h3>{status === 'email' ? 'Ready in your email app.' : 'Thank you for sharing your vision.'}</h3>
          <p>{status === 'email' ? 'Send the prepared message from your email app to complete your enquiry. You can also email the studio directly.' : 'Your enquiry has been submitted. The studio will be in touch to discuss what comes next.'}</p>
          <a href={`mailto:${email}`}>{email}</a>
          <button className="enquiry-return" onClick={close}>Back to {category.label.toLowerCase()}<ArrowUpRight size={16} /></button>
        </div> : <>
          <p className="enquiry-eyebrow">Your next chapter</p>
          <h3>Tell us what you have in mind.</h3>
          <p className="enquiry-panel__intro">A few details to begin. Fields marked * are required.</p>
          <form className="enquiry-form" name="project-enquiry" onSubmit={submit}>
            <input type="hidden" name="form-name" value="project-enquiry" />
            <input type="hidden" name="area" value={category.label} />
            <p hidden><label>Leave this blank<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
            <div className="enquiry-form__grid">
              <label>First name *<input name="first-name" autoComplete="given-name" required /></label>
              <label>Last name *<input name="last-name" autoComplete="family-name" required /></label>
              <label>Email address *<input name="email" type="email" autoComplete="email" required /></label>
              <label>Phone (optional)<input name="phone" type="tel" autoComplete="tel" /></label>
              <label className="enquiry-form__full">Service of interest *<select name="service" value={service} onChange={event => setService(event.target.value)} required><option value="">Choose a service</option>{category.services.map(item => <option key={item.id}>{item.title}</option>)}<option>Help me choose</option></select></label>
              <label className="enquiry-form__full">Project address (optional)<input name="project-address" autoComplete="street-address" /></label>
              <label className="enquiry-form__full">Tell us about your project *<textarea name="message" rows={3} placeholder="Your ideas, project stage or questions…" required /></label>
            </div>
            <label className="enquiry-consent"><input type="checkbox" name="consent" value="yes" required /><span>I agree to Ferhan using these details to respond to my enquiry.</span></label>
            {error && <p className="enquiry-error" role="alert">{error}</p>}
            <PlaneButton className="enquiry-submit" type="submit" label={isLocal ? 'Continue to email' : 'Send enquiry'} sending={status === 'sending'} disabled={status === 'sending'} />
            <p className="enquiry-form__note">{isLocal ? 'Your enquiry will open in your email app, ready to send.' : 'Your details are used only to respond to your enquiry.'}</p>
          </form>
        </>}
      </div>
    </motion.section>
  </motion.div>}</AnimatePresence>
}

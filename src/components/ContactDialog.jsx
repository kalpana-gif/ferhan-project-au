import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseIcon } from './BrandMark'
import { dialog, overlay } from '../motion'
import { useModalA11y } from '../hooks/useModalA11y'

const initialForm = { name: '', phone: '', email: '', message: '', consent: false }

export default function ContactDialog({ isOpen, onClose }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const dialogRef = useRef(null)
  const formRef = useRef(null)
  const sendTimerRef = useRef(null)

  const resetAndClose = () => {
    window.clearTimeout(sendTimerRef.current)
    sendTimerRef.current = null
    setStatus('idle')
    setErrors({})
    onClose()
  }

  useModalA11y(isOpen, dialogRef, resetAndClose)

  useEffect(() => () => window.clearTimeout(sendTimerRef.current), [])

  useEffect(() => {
    const firstError = Object.keys(errors)[0]
    if (!firstError) return
    formRef.current?.elements[firstError]?.focus()
  }, [errors])

  const update = (event) => {
    const { name, value, checked, type } = event.target
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.'
    if (!form.email.trim()) nextErrors.email = 'Please enter your email address.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (!form.consent) nextErrors.consent = 'Please confirm the privacy notice.'
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    setStatus('sending')
    sendTimerRef.current = window.setTimeout(() => setStatus('success'), 700)
  }

  return (
    <AnimatePresence>
      {isOpen && <motion.div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && resetAndClose()} variants={overlay} initial="hidden" animate="visible" exit="exit">
      <motion.section ref={dialogRef} className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-title" variants={dialog} initial="hidden" animate="visible" exit="exit">
        <button className="dialog-close" onClick={resetAndClose} data-modal-autofocus aria-label="Close contact form"><CloseIcon /></button>
        {status === 'success' ? (
          <div className="form-success" role="status" aria-live="polite">
            <p className="dialog-eyebrow">Thank you</p>
            <h2 id="contact-title">Your message is on its way.</h2>
            <p>We’ll be in touch shortly to discuss your project.</p>
            <button className="text-button" onClick={resetAndClose}>Return to the studio <span>←</span></button>
          </div>
        ) : (
          <>
            <p className="dialog-eyebrow">Contact us</p>
            <h2 id="contact-title">Let’s make something considered.</h2>
            <p className="contact-intro">205A Wharf Street, Queens Park WA 6107<br /><a href="tel:+61402427059">+61 (0) 402 427 059</a> · <a href="mailto:cf@ferhandesign.com.au">Email the studio</a></p>
            <form ref={formRef} onSubmit={submit} noValidate>
              <div className="form-grid">
                <label>
                  <span>Name</span>
                  <input name="name" value={form.name} onChange={update} autoComplete="name" required aria-required="true" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
                  {errors.name && <em id="name-error" role="alert">{errors.name}</em>}
                </label>
                <label>
                  <span>Phone number</span>
                  <input name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" />
                </label>
                <label className="form-full">
                  <span>Email address</span>
                  <input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required aria-required="true" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
                  {errors.email && <em id="email-error" role="alert">{errors.email}</em>}
                </label>
                <label className="form-full">
                  <span>Tell us a little about your project</span>
                  <textarea name="message" rows="3" value={form.message} onChange={update} />
                </label>
              </div>
              <label className="consent">
                <input name="consent" type="checkbox" checked={form.consent} onChange={update} required aria-required="true" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'consent-error' : undefined} />
                <span>I understand my data will be stored so the studio can respond to this enquiry.</span>
              </label>
              {errors.consent && <em id="consent-error" className="form-error" role="alert">{errors.consent}</em>}
              <button className="submit-button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send enquiry'}</button>
            </form>
          </>
        )}
      </motion.section>
    </motion.div>}
    </AnimatePresence>
  )
}

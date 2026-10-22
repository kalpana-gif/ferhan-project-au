import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import PlaneButton from '../shared/PlaneButton'
import InlineTechText from '../effects/InlineTechText'
import { fadeUp, stagger } from '../../animations/variants'

export function ContactSection({ onOpenContact }) {
  return (
    <section id="contact" className="content-section contact-section">
      <div className="contact-map">
        <iframe
          title="Studio location — 205A Wharf Street, Queens Park WA 6107"
          src="https://www.google.com/maps?q=205A%20Wharf%20Street%2C%20Queens%20Park%20WA%206107%2C%20Australia&z=16&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <motion.div className="contact-content" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <motion.p className="section-kicker" variants={fadeUp}>Get in touch</motion.p>
        <motion.h2 variants={fadeUp}><InlineTechText text="Tell us what you have in mind." specks={8} speed={0.65} strokeWidth={1} /></motion.h2>
        <motion.p variants={fadeUp}>A new home, a fresh perspective, or just the beginning of an idea. We’d love to hear about it.</motion.p>
        <PlaneButton className="contact-primary-action" type="button" icon="message" label="Start a conversation" onClick={onOpenContact} aria-haspopup="dialog" />
        <motion.ul className="contact-details" variants={fadeUp} role="list">
          <li>
            <a className="contact-detail" href="mailto:cf@ferhandesign.com.au">
              <span className="contact-detail__icon"><Mail aria-hidden="true" /></span>
              <span className="contact-detail__copy">
                <span className="contact-detail__label">Email</span>
                <span className="contact-detail__value">cf@ferhandesign.com.au</span>
              </span>
            </a>
          </li>
          <li>
            <a className="contact-detail" href="tel:+61402427059">
              <span className="contact-detail__icon"><Phone aria-hidden="true" /></span>
              <span className="contact-detail__copy">
                <span className="contact-detail__label">Call</span>
                <span className="contact-detail__value">+61 (0) 402 427 059</span>
              </span>
            </a>
          </li>
          <li>
            <a className="contact-detail" href="https://www.google.com/maps/search/?api=1&query=205A%20Wharf%20Street%2C%20Queens%20Park%20WA%206107%2C%20Australia" target="_blank" rel="noopener noreferrer">
              <span className="contact-detail__icon"><MapPin aria-hidden="true" /></span>
              <span className="contact-detail__copy">
                <span className="contact-detail__label">Visit</span>
                <span className="contact-detail__value">205A Wharf Street, Queens Park WA 6107 <span className="sr-only">(opens in Google Maps in a new tab)</span></span>
              </span>
            </a>
          </li>
        </motion.ul>
      </motion.div>
    </section>
  )
}

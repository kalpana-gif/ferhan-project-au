import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowIcon, CloseIcon } from '../shared/BrandMark'
import { dialog, overlay } from '../../animations/variants'
import { useModalA11y } from '../../hooks/useModalA11y'

export default function DetailDialog({ slide, onClose, onContact }) {
  const dialogRef = useRef(null)
  const isHome = slide?.id === 'home'
  const isContact = slide?.id === 'contact'
  const paragraphs = isHome
    ? [
        'We create architecture and interiors shaped around the way people live, work, and gather.',
        'Our studio brings strategic thinking, design craft and technical rigor together from first sketch to final detail.',
      ]
    : isContact
      ? ['Tell us about your project and the way you want it to feel. Our Perth studio will be happy to start the conversation.']
      : slide ? [
          `${slide.eyebrow} projects are considered as a complete experience: practical, enduring, and unmistakably personal.`,
          'Our multidisciplinary team guides every stage of a project, balancing bold ideas with an exacting attention to detail.',
        ] : []

  useModalA11y(Boolean(slide), dialogRef, onClose)

  return (
    <AnimatePresence>
      {slide && (
        <motion.div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()} variants={overlay} initial="hidden" animate="visible" exit="exit">
          <motion.section ref={dialogRef} className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title" variants={dialog} initial="hidden" animate="visible" exit="exit">
            <button className="dialog-close" onClick={onClose} data-modal-autofocus aria-label="Close details"><CloseIcon /></button>
            <p className="dialog-eyebrow">{slide.eyebrow}</p>
            <h2 id="detail-title">{slide.title}</h2>
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {isContact ? (
              <button className="text-button" onClick={onContact}>Start a conversation <span>↗</span></button>
            ) : (
              <button className="back-control dialog-back" onClick={onClose}>
                <span className="back-control__icon" aria-hidden="true"><ArrowIcon direction="left" /></span>
                <span>Back to the collection</span>
              </button>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

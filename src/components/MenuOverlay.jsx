import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrandMark, CloseIcon } from './BrandMark'
import { navigation } from '../data/navigation'
import { portfolioGroups, serviceGroups } from '../data/slides'
import { fadeUp, overlay, stagger } from '../motion'
import { useModalA11y } from '../hooks/useModalA11y'

function MenuLevel({ title, items, onSelect, onBack }) {
  return (
    <motion.section className="menu-level" aria-label={title} variants={stagger} initial="hidden" animate="visible" exit="hidden">
      <motion.button className="menu-back" onClick={onBack} variants={fadeUp}>← Back</motion.button>
      <motion.p className="menu-kicker" variants={fadeUp}>{title}</motion.p>
      <motion.ul variants={stagger}>
        {items.map((item) => (
          <motion.li key={item.label} variants={fadeUp}>
            <motion.button onClick={() => onSelect(item.slideId)} whileHover={{ x: 7 }} whileTap={{ scale: 0.98 }}>
              <span>{item.label}</span><span aria-hidden="true">↗</span>
            </motion.button>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  )
}

export default function MenuOverlay({ isOpen, onClose, onNavigate, onSlideSelect }) {
  const [section, setSection] = useState(null)
  const [service, setService] = useState(null)
  const dialogRef = useRef(null)

  useModalA11y(isOpen, dialogRef, onClose)

  useEffect(() => {
    if (!isOpen) {
      setSection(null)
      setService(null)
    }
  }, [isOpen])

  const closeAndNavigate = (id) => {
    onNavigate(id)
    onClose()
  }

  const closeAndSelect = (slideId) => {
    onSlideSelect(slideId)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="menu-overlay"
          ref={dialogRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          variants={overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div className="menu-image" aria-hidden="true" initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.03, opacity: 0 }} transition={{ duration: 0.6 }} />
          <div className="menu-wash" />
          <div className="menu-content">
            <div className="menu-topline">
              <BrandMark />
              <motion.button className="menu-close" onClick={onClose} data-modal-autofocus aria-label="Close navigation" whileTap={{ scale: 0.88 }}><CloseIcon /></motion.button>
            </div>

            <nav className="menu-main" aria-label="Main navigation">
              <AnimatePresence mode="wait">
                {!section && (
                  <motion.div className="menu-root" variants={stagger} initial="hidden" animate="visible" exit="hidden" key="root">
                    <motion.ul variants={stagger}>
                      {navigation.map((item) => (
                        <motion.li key={item.id} variants={fadeUp}>
                          <motion.button onClick={() => closeAndNavigate(item.id)} whileHover={{ x: 8 }} whileTap={{ scale: 0.98 }}>{item.label}</motion.button>
                        </motion.li>
                      ))}
                    </motion.ul>
                    <motion.div className="menu-explore" variants={fadeUp}>
                      <button onClick={() => setSection('services')}>Browse individual services <span>↗</span></button>
                      <button onClick={() => setSection('portfolio')}>Browse selected work <span>↗</span></button>
                    </motion.div>
                  </motion.div>
                )}
                {section === 'portfolio' && <MenuLevel key="portfolio" title="Selected work" items={portfolioGroups} onSelect={closeAndSelect} onBack={() => setSection(null)} />}
                {section === 'services' && !service && (
                  <motion.section className="menu-level" aria-label="Services" variants={stagger} initial="hidden" animate="visible" exit="hidden" key="services">
                    <motion.button className="menu-back" onClick={() => setSection(null)} variants={fadeUp}>← Back</motion.button>
                    <motion.p className="menu-kicker" variants={fadeUp}>Services</motion.p>
                    <motion.ul variants={stagger}>
                      {serviceGroups.map((item) => (
                        <motion.li key={item.label} variants={fadeUp}>
                          <motion.button onClick={() => (item.items.length === 1 ? closeAndSelect(item.items[0].slideId) : setService(item))} whileHover={{ x: 7 }} whileTap={{ scale: 0.98 }}>
                            <span>{item.label}</span>{item.items.length > 1 && <span aria-hidden="true">+</span>}
                          </motion.button>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.section>
                )}
                {section === 'services' && service && <MenuLevel key={service.label} title={service.label} items={service.items} onSelect={closeAndSelect} onBack={() => setService(null)} />}
              </AnimatePresence>
            </nav>

            <motion.div className="menu-footer" variants={stagger} initial="hidden" animate="visible">
              <motion.div className="menu-socials" variants={fadeUp}>
                <a href="tel:+61402427059">+61 (0) 402 427 059</a>
                <a href="mailto:cf@ferhandesign.com.au">cf@ferhandesign.com.au</a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

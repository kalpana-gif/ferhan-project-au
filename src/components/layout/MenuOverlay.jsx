import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowIcon, BrandMark, CloseIcon } from '../shared/BrandMark'
import LearnMoreButton from '../shared/LearnMoreButton'
import { navigation } from '../../data/navigation'
import { servicePaths } from '../../data/servicePaths'
import { portfolioGroups, slides } from '../../data/slides'
import { dialog, overlay } from '../../animations/variants'
import { useModalA11y } from '../../hooks/useModalA11y'

const fadeUp = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.035 } } }

const menuPreviews = {
  ...Object.fromEntries(slides.map((slide) => [slide.id, {
    image: slide.image,
    alt: `${slide.eyebrow} ${slide.title}`,
    label: slide.title,
  }])),
  home: { image: '/assets/1-13.jpg', alt: 'Sculptural staircase and blue upholstered bench', label: 'Home' },
  services: { image: '/assets/slide_02-1600x1068.jpg', alt: 'Contemporary residential architecture', label: 'Services' },
  ...Object.fromEntries(servicePaths.map((service) => [service.id, { image: service.image, alt: service.title, label: service.title }])),
  portfolio: { image: '/assets/gallery-exterior-day.jpg', alt: 'Contemporary home in a landscaped garden', label: 'Portfolio' },
  gallery: { image: '/assets/gallery-loft-interior.jpg', alt: 'Contemporary loft interior', label: 'Gallery' },
  about: { image: '/assets/slide_10-810x1080.jpg', alt: 'Farhan Architects interior detail', label: 'About' },
  team: { image: '/assets/team/team-01.webp', alt: 'Farhan Architects studio team member', label: 'Team' },
  contact: { image: '/assets/gallery-forest-house.jpg', alt: 'Contemporary home surrounded by trees', label: 'Contact' },
}

function MenuBackButton({ onClick }) {
  return (
    <motion.button className="back-control menu-back" onClick={onClick} variants={fadeUp}>
      <span className="back-control__icon" aria-hidden="true"><ArrowIcon direction="left" /></span>
      <span>Back</span>
    </motion.button>
  )
}

function MenuLevel({ title, items, onSelect, onBack, onPreview }) {
  return (
    <motion.section className="menu-level" aria-label={title} variants={stagger} initial="hidden" animate="visible" exit="hidden">
      <MenuBackButton onClick={onBack} />
      <motion.p className="menu-kicker" variants={fadeUp}>{title}</motion.p>
      <motion.ul variants={stagger}>
        {items.map((item) => (
          <motion.li key={item.label} variants={fadeUp}>
            <motion.button onClick={() => onSelect(item.slideId)} onPointerEnter={() => onPreview(item.slideId)} onFocus={() => onPreview(item.slideId)}>
              <span>{item.label}</span><span aria-hidden="true"><ArrowIcon /></span>
            </motion.button>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  )
}

export default function MenuOverlay({ isOpen, activeSection, onClose, onNavigate, onSlideSelect }) {
  const [section, setSection] = useState(null)
  const [previewId, setPreviewId] = useState(null)
  const dialogRef = useRef(null)

  const defaultPreviewId = section === 'portfolio'
    ? portfolioGroups[0].slideId
    : section === 'services'
      ? servicePaths[0].id
      : activeSection
  const preview = menuPreviews[previewId] || menuPreviews[defaultPreviewId] || menuPreviews.home

  useModalA11y(isOpen, dialogRef, onClose)

  useEffect(() => {
    if (!isOpen) {
      setSection(null)
      setPreviewId(null)
    }
  }, [isOpen])

  useEffect(() => setPreviewId(null), [section])

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
          className="menu-backdrop"
          variants={overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.div
            className="menu-overlay"
            ref={dialogRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            variants={dialog}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
          <div className="menu-content">
            <div className="menu-topline">
              <BrandMark />
              <motion.button className="menu-close" onClick={onClose} data-modal-autofocus aria-label="Close navigation"><CloseIcon /></motion.button>
            </div>

            <div className="menu-body">
            <nav className="menu-main" aria-label="Main navigation" onPointerLeave={() => setPreviewId(null)} onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setPreviewId(null)
            }}>
              <AnimatePresence mode="wait">
                {!section && (
                  <motion.div className="menu-root" variants={stagger} initial="hidden" animate="visible" exit="hidden" key="root">
                    <motion.ul variants={stagger}>
                      {navigation.map((item) => (
                        <motion.li key={item.id} variants={fadeUp}>
                          <motion.button onClick={() => item.id === 'services' ? setSection('services') : closeAndNavigate(item.id)} onPointerEnter={() => setPreviewId(item.id)} onFocus={() => setPreviewId(item.id)} aria-current={activeSection === item.id ? 'location' : undefined}><span>{item.label}</span><span className="menu-link-arrow" aria-hidden="true"><ArrowIcon /></span></motion.button>
                        </motion.li>
                      ))}
                    </motion.ul>
                    <motion.div className="menu-explore" variants={fadeUp}>
                      <LearnMoreButton onClick={() => closeAndNavigate('choose')}>Choose a path</LearnMoreButton>
                      <LearnMoreButton onClick={() => setSection('portfolio')}>Selected projects</LearnMoreButton>
                    </motion.div>
                  </motion.div>
                )}
                {section === 'portfolio' && <MenuLevel key="portfolio" title="Selected work" items={portfolioGroups} onSelect={closeAndSelect} onBack={() => setSection(null)} onPreview={setPreviewId} />}
                {section === 'services' && (
                  <motion.section className="menu-level" aria-label="Services" variants={stagger} initial="hidden" animate="visible" exit="hidden" key="services">
                    <MenuBackButton onClick={() => setSection(null)} />
                    <motion.p className="menu-kicker" variants={fadeUp}>Services</motion.p>
                    <motion.ul variants={stagger}>
                      {servicePaths.map((item) => (
                        <motion.li key={item.id} variants={fadeUp}>
                          <motion.a href={item.path} aria-current={window.location.pathname === item.path ? 'page' : undefined} onPointerEnter={() => setPreviewId(item.id)} onFocus={() => setPreviewId(item.id)}>
                            <span>{item.title}{!item.available && <small>Coming soon</small>}</span><span aria-hidden="true"><ArrowIcon /></span>
                          </motion.a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.section>
                )}
              </AnimatePresence>
            </nav>
            <figure className="menu-feature">
              <div className="menu-feature__media">
                <AnimatePresence initial={false}>
                  <motion.img key={preview.image} src={preview.image} alt={preview.alt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.24 }} />
                </AnimatePresence>
              </div>
              <figcaption><span>Farhan Architects</span><span>{preview.label}</span></figcaption>
            </figure>
            </div>

            <motion.div className="menu-footer" variants={stagger} initial="hidden" animate="visible">
              <span className="menu-location">Perth, Western Australia</span>
              <motion.div className="menu-socials" variants={fadeUp}>
                <a href="tel:+61402427059">+61 (0) 402 427 059</a>
                <a href="mailto:cf@ferhandesign.com.au">cf@ferhandesign.com.au</a>
              </motion.div>
            </motion.div>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

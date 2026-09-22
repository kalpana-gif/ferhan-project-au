import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Globe2, Link2, Mail } from 'lucide-react'
import { ArrowIcon } from './BrandMark'
import AccordionGallery from './AccordionGallery'
import { portfolioGroups, slides } from '../data/slides'
import { fadeUp, stagger } from '../motion'

const serviceSlides = slides.filter((slide) => slide.group === 'Services')
const aboutSlide = slides.find((slide) => slide.id === 'about')
const portfolioSlides = portfolioGroups.map((group) => slides.find((slide) => slide.id === group.slideId))

const teamMembers = [
  {
    name: 'Amelia Hart',
    role: 'Studio Director',
    image: '/assets/team/team-01.webp'
  },
  {
    name: 'Noah Bennett',
    role: 'Senior Architect',
    image: '/assets/team/team-02.webp'
  },
  {
    name: 'Olivia Chen',
    role: 'Interior Designer',
    image: '/assets/team/team-03.webp'
  },
  {
    name: 'Ethan Walker',
    role: 'Project Architect',
    image: '/assets/team/team-04.webp'
  },
  {
    name: 'Maya Patel',
    role: 'Urban Designer',
    image: '/assets/team/team-05.webp'
  },
  {
    name: 'Lucas Morgan',
    role: 'Design Technician',
    image: '/assets/team/team-06.webp'
  }
]

function TeamProfileCard({ member, index, duplicate = false }) {
  return (
    <motion.article
      className="team-profile-card"
      variants={duplicate ? undefined : fadeUp}
      whileHover={{ y: -5 }}
    >
      <header className="team-profile-card__header">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3>{member.name}</h3>
          <p>{member.role}</p>
        </div>
      </header>
      <div className="team-profile-card__portrait">
        <img src={member.image} alt={`${member.name}, ${member.role}`} loading="lazy" decoding="async" draggable="false" />
      </div>
      <footer className="team-profile-card__footer">
        <span>Perth, WA</span>
        <div aria-label={`${member.name} social profiles`}>
          <Globe2 aria-hidden="true" />
          <Link2 aria-hidden="true" />
          <Mail aria-hidden="true" />
        </div>
      </footer>
    </motion.article>
  )
}

function TeamTape() {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const setTrackOffset = (nextOffset) => {
    const track = trackRef.current
    const groupWidth = track?.firstElementChild?.getBoundingClientRect().width ?? 0

    if (!track || !groupWidth) return

    let wrappedOffset = nextOffset
    while (wrappedOffset <= -groupWidth) wrappedOffset += groupWidth
    while (wrappedOffset > 0) wrappedOffset -= groupWidth

    offsetRef.current = wrappedOffset
    track.style.transform = `translate3d(${wrappedOffset}px, 0, 0)`
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let previousTime = performance.now()
    let animationFrame

    const moveTape = (time) => {
      const elapsed = Math.min(time - previousTime, 64)
      previousTime = time

      if (!isDraggingRef.current && !reduceMotion.matches) {
        setTrackOffset(offsetRef.current - elapsed * 0.05)
      }

      animationFrame = requestAnimationFrame(moveTape)
    }

    animationFrame = requestAnimationFrame(moveTape)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    isDraggingRef.current = true
    dragStartXRef.current = event.clientX
    dragStartOffsetRef.current = offsetRef.current
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) return
    setTrackOffset(dragStartOffsetRef.current + event.clientX - dragStartXRef.current)
  }

  const finishDragging = (event) => {
    if (!isDraggingRef.current) return

    isDraggingRef.current = false
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <motion.div
      className={`team-roster-viewport ${isDragging ? 'is-dragging' : ''}`}
      aria-label="Farhan Architects team"
      title="Drag to explore the team"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDragging}
      onPointerCancel={finishDragging}
    >
      <div className="team-roster" ref={trackRef}>
        <div className="team-roster__group">
          {teamMembers.map((member, index) => (
            <TeamProfileCard member={member} index={index} key={member.name} />
          ))}
        </div>
        <div className="team-roster__group" aria-hidden="true">
          {teamMembers.map((member, index) => (
            <TeamProfileCard member={member} index={index} key={`${member.name}-duplicate`} duplicate />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const galleryItems = [
  {
    type: 'image',
    image: '/assets/gallery-exterior-day.jpg',
    alt: 'Modern white home and landscaped garden beneath a soft evening sky',
    label: 'Garden residence'
  },
  {
    type: 'image',
    image: '/assets/gallery-forest-house.jpg',
    alt: 'Contemporary timber and concrete home surrounded by mature trees',
    label: 'Forest edge'
  },
  {
    type: 'video',
    video: '/assets/gallery-feature.mp4',
    poster: '/assets/gallery-exterior-dusk.jpg',
    label: 'Architecture in motion'
  },
  {
    type: 'image',
    image: '/assets/gallery-loft-interior.jpg',
    alt: 'Dark contemporary loft interior with brick, timber and generous windows',
    label: 'Material contrast'
  },
  {
    type: 'image',
    image: '/assets/gallery-exterior-dusk.jpg',
    alt: 'Modern glass-fronted home glowing warmly at dusk',
    label: 'Evening light'
  }
]

function SectionHeading({ eyebrow, title, children, light = false }) {
  return (
    <motion.div className={`section-heading ${light ? 'is-light' : ''}`} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
      <motion.p className="section-kicker" variants={fadeUp}>{eyebrow}</motion.p>
      <motion.h2 variants={fadeUp}>{title}</motion.h2>
      {children && <motion.div className="section-copy" variants={fadeUp}>{children}</motion.div>}
    </motion.div>
  )
}

export function ServicesSection({ onOpenDetail }) {
  return (
    <section id="services" className="content-section services-section">
      <div className="section-shell">
        <SectionHeading eyebrow="What we do" title="A full spectrum of design thinking.">
          <p>From first possibility to the final detail, our Perth studio brings residential, multi-residential and commercial architecture into one considered process.</p>
        </SectionHeading>
        <motion.div className="service-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {serviceSlides.map((slide) => (
            <motion.button
              className="service-card"
              key={slide.id}
              variants={fadeUp}
              onClick={() => onOpenDetail(slide)}
              whileHover={{ y: -7 }}
              whileTap={{ scale: 0.99 }}
            >
              <img src={slide.image} alt="" />
              <span className="card-shade" />
              <span className="card-content">
                <span className="card-type">{slide.eyebrow}</span>
                <strong>{slide.title}</strong>
                <span className="card-link">Explore <ArrowIcon /></span>
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function PortfolioSection({ onOpenDetail }) {
  return (
    <section id="portfolio" className="content-section portfolio-section">
      <div className="section-shell">
        <SectionHeading eyebrow="Selected work" title="Spaces with a distinct sense of place." light>
          <p>Every project balances enduring ideas with the particular character of its site, its people and its moment.</p>
        </SectionHeading>
        <motion.div className="portfolio-list" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {portfolioSlides.map((slide, index) => (
            <motion.article className={`portfolio-feature feature-${index + 1}`} key={slide.id} variants={fadeUp}>
              <motion.button onClick={() => onOpenDetail(slide)} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.99 }}>
                <img src={slide.image} alt="" />
                <span className="portfolio-overlay" />
                <span className="portfolio-label"><em>{slide.eyebrow}</em><strong>{slide.title}</strong><i>View project <ArrowIcon /></i></span>
              </motion.button>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export function GallerySection() {
  return (
    <section id="gallery" className="content-section gallery-section">
      <div className="section-shell gallery-shell">
        <SectionHeading eyebrow="Studio gallery" title="A closer look at the details that hold a space together.">
          <p>Move through a selection of moments shaped by light, material and the pleasure of everyday use.</p>
        </SectionHeading>
        <motion.div
          className="gallery-frame"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <AccordionGallery
            className="studio-accordion-gallery"
            items={galleryItems}
            defaultIndex={2}
            accentColor="#ffffff"
            overlayColor="#000000"
            textColor="#ffffff"
            height={600}
            gap={10}
            radius={3}
            expandRatio={0.58}
            duration={0.72}
            ease="power3.inOut"
            parallax={0.34}
            tilt={0}
            trigger="hover"
            grayscale={false}
          />
        </motion.div>
        <motion.div className="gallery-note" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <p>Explore the composition</p>
          <span>Hover, tap or use the arrow keys to expand one frame at a time.</span>
        </motion.div>
      </div>
    </section>
  )
}

export function AboutSection({ onNavigate }) {
  return (
    <section id="about" className="content-section about-section">
      <div className="about-image" aria-hidden="true"><img src={aboutSlide.image} alt="" /></div>
      <motion.div className="about-content" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.28 }}>
        <motion.p className="section-kicker" variants={fadeUp}>The studio</motion.p>
        <motion.h2 variants={fadeUp}>Design matters when it changes how a place feels.</motion.h2>
        <motion.p variants={fadeUp}>Farhan Architects is an architecture and design studio based in Perth, Western Australia. Specialising in residential, multi-residential, and commercial architecture since 2007.</motion.p>
        <motion.div className="about-statements" variants={fadeUp}>
          <span>Architecture</span><span>Interiors</span><span>Design &amp; Build</span>
        </motion.div>
        <motion.button className="dark-text-button" onClick={() => onNavigate('contact')} variants={fadeUp} whileHover={{ x: 4 }}>
          Work with us <ArrowIcon />
        </motion.button>
      </motion.div>
    </section>
  )
}

export function TeamSection() {
  return (
    <section id="team" className="content-section team-section">
      <div className="section-shell team-shell">
        <SectionHeading eyebrow="The team" title="Different disciplines. One point of view.">
          <p>Our architects, interior designers, planners and delivery specialists work as one studio from the first conversation through to the final detail.</p>
        </SectionHeading>
        <TeamTape />
      </div>
    </section>
  )
}

export function ContactSection({ onOpenContact }) {
  return (
    <section id="contact" className="content-section contact-section">
      <motion.div className="contact-image" initial={{ opacity: 0, scale: 1.04 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
        <img src="/assets/gallery-exterior-dusk.jpg" alt="Contemporary timber and glass residence glowing at dusk" />
      </motion.div>
      <motion.div className="contact-content" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <motion.p className="section-kicker" variants={fadeUp}>Contact</motion.p>
        <motion.h2 variants={fadeUp}>Let’s make something considered.</motion.h2>
        <motion.p variants={fadeUp}>Start a conversation about your project, or visit our studio in Queens Park.</motion.p>
        <motion.button className="light-text-button" onClick={onOpenContact} variants={fadeUp} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
          Get in touch <ArrowIcon />
        </motion.button>
        <motion.div className="contact-details" variants={fadeUp}>
          <p>205A Wharf Street<br />Queens Park WA 6107</p>
          <a href="tel:+61402427059">+61 (0) 402 427 059</a>
          <a href="mailto:cf@ferhandesign.com.au">cf@ferhandesign.com.au</a>
        </motion.div>
      </motion.div>
    </section>
  )
}

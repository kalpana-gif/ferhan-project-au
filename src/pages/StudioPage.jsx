import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Header from '../components/layout/Header'
import MenuOverlay from '../components/layout/MenuOverlay'
import DetailDialog from '../components/dialogs/DetailDialog'
import ContactDialog from '../components/dialogs/ContactDialog'
import ConstructionScroll from '../components/effects/ConstructionScroll'
import SiteFooter from '../components/layout/SiteFooter'
import { AboutSection, ContactSection, GallerySection, PortfolioSection, ScrollExpandIntro, ScrollExpandScene, ServicesSection, TeamSection } from '../components/sections'
import { navigationIds } from '../data/navigation'
import { slides } from '../data/slides'
import { useActiveSection } from '../hooks/useActiveSection'

function SiteOpeningReveal() {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(true)
  if (reduceMotion || !visible) return null

  return (
    <motion.div
      className="site-opening-reveal"
      aria-hidden="true"
      initial={{ clipPath: 'inset(0 0 0 0)' }}
      animate={{ clipPath: 'inset(100% 0 0 0)' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      onAnimationComplete={() => setVisible(false)}
    />
  )
}

export default function StudioPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [detailSlide, setDetailSlide] = useState(null)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const { activeSection, navigateTo } = useActiveSection(navigationIds)

  useEffect(() => {
    if (!window.location.hash) return
    const targetId = decodeURIComponent(window.location.hash.slice(1))
    const frame = requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const selectSlide = (id) => {
    const slide = slides.find((item) => item.id === id)
    if (!slide) return
    if (slide.id === 'contact') setIsContactOpen(true)
    else setDetailSlide(slide)
  }

  const openDetail = (slide) => {
    if (slide.id === 'contact') setIsContactOpen(true)
    else setDetailSlide(slide)
  }

  const navigate = (id) => {
    setIsMenuOpen(false)
    if (id === 'choose') {
      window.location.assign('/')
      return
    }
    navigateTo(id)
  }

  return (
    <>
      <SiteOpeningReveal />
      <main className="app">
        <Header
          activeSection={activeSection}
          isMenuOpen={isMenuOpen}
          isScrolled={activeSection !== 'home'}
          onMenuToggle={() => setIsMenuOpen((value) => !value)}
          onNavigate={navigate}
          onChoosePath={() => navigate('choose')}
        />

        <section id="home" className="home-section">
          <ScrollExpandIntro onDiscover={() => navigate('services')} />
          <ConstructionScroll />
        </section>
        <ServicesSection onOpenDetail={openDetail} />
        <ScrollExpandScene
          variant="work"
          src="/assets/slide_05-1600x887.jpg"
          alt="A dark blue panelled room viewed through black-framed glass doors"
          title="Every threshold holds a story."
          eyebrow="Selected work"
          heading="From structure to atmosphere."
          description="A considered sequence of materials, light and proportion turns each room into somewhere you want to stay."
          actionLabel="View selected work"
          onAction={() => navigate('portfolio')}
          startWidth={46}
          startHeight={59}
          startRadius={24}
          mediaZoom={1.2}
          scrollDistance={0.78}
          holdDistance={0.2}
          overlayScrim={0.58}
        />
        <PortfolioSection onOpenDetail={openDetail} />
        <GallerySection />
        <AboutSection onNavigate={navigate} />
        <TeamSection />
        <ScrollExpandScene
          variant="contact"
          src="/assets/gallery-exterior-day.jpg"
          alt="A contemporary Farhan Architects residence with landscaped gardens at dusk"
          title="The next room starts here."
          eyebrow="Begin a conversation"
          heading="The best projects start with a shared point of view."
          description="Bring us the brief, the questions and the ambition. We will help shape what comes next."
          startWidth={50}
          startHeight={61}
          startRadius={22}
          mediaZoom={1.16}
          scrollDistance={0.74}
          holdDistance={0.2}
          overlayScrim={0.54}
        />
        <ContactSection onOpenContact={() => setIsContactOpen(true)} />
        <SiteFooter onNavigate={navigate} />
      </main>
      <MenuOverlay
        activeSection={activeSection}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={navigate}
        onSlideSelect={selectSlide}
      />
      <DetailDialog slide={detailSlide} onClose={() => setDetailSlide(null)} onContact={() => { setDetailSlide(null); setIsContactOpen(true) }} />
      <ContactDialog isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  )
}

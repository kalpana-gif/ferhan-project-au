import { useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Header from './components/Header'
import MenuOverlay from './components/MenuOverlay'
import DetailDialog from './components/DetailDialog'
import ContactDialog from './components/ContactDialog'
import ConstructionScroll from './components/ConstructionScroll'
import ScrollExpandIntro from './components/ScrollExpandIntro'
import ScrollExpandScene from './components/ScrollExpandScene'
import SiteFooter from './components/SiteFooter'
import { AboutSection, ContactSection, GallerySection, PortfolioSection, ServicesSection, TeamSection } from './components/ContentSections'
import { navigationIds } from './data/navigation'
import { slides } from './data/slides'
import { useActiveSection } from './hooks/useActiveSection'

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [detailSlide, setDetailSlide] = useState(null)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const { activeSection, navigateTo } = useActiveSection(navigationIds)

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
    navigateTo(id)
    setIsMenuOpen(false)
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="app">
        <Header
          activeSection={activeSection}
          isMenuOpen={isMenuOpen}
          isScrolled={activeSection !== 'home'}
          onMenuToggle={() => setIsMenuOpen((value) => !value)}
          onNavigate={navigate}
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
          actionLabel="Start a conversation"
          onAction={() => setIsContactOpen(true)}
          startWidth={50}
          startHeight={61}
          startRadius={22}
          mediaZoom={1.16}
          scrollDistance={0.74}
          holdDistance={0.2}
          overlayScrim={0.54}
        />
        <ContactSection onOpenContact={() => setIsContactOpen(true)} />
        <SiteFooter onNavigate={navigate} onOpenContact={() => setIsContactOpen(true)} />
      </main>
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={navigate}
        onSlideSelect={selectSlide}
      />
      <DetailDialog slide={detailSlide} onClose={() => setDetailSlide(null)} onContact={() => { setDetailSlide(null); setIsContactOpen(true) }} />
      <ContactDialog isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </MotionConfig>
  )
}

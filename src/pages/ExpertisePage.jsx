import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, Plus, Check } from 'lucide-react'
import { BrandMark } from '../components/shared/BrandMark'
import MenuOverlay from '../components/layout/MenuOverlay'
import ServicePathDropdown from '../components/layout/ServicePathDropdown'
import HeaderContactButton from '../components/layout/HeaderContactButton'
import SiteFooter from '../components/layout/SiteFooter'
import { useActiveSection } from '../hooks/useActiveSection'
import { servicePaths } from '../data/servicePaths'
import { expertise } from '../data/expertise'
import ScrollExpand from '../components/effects/ScrollExpand'
import InlineTechText from '../components/effects/InlineTechText'
import ScrollExpandScene from '../components/sections/ScrollExpandScene'
import SectionHeading from '../components/sections/SectionHeading'
import ContactDialog from '../components/dialogs/ContactDialog'
import { fadeUp, stagger } from '../animations/variants'
import '../styles/expertise.css'
import '../components/sections/ScrollExpandIntro.css'

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } }
const menuItems = [
  { id: 'expertise-main', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'approach', label: 'Our approach' },
  { id: 'contact', label: 'Contact' },
]
const overviewSectionIds = ['expertise-main', 'services', 'approach', 'contact']
const serviceSectionIds = ['expertise-main', 'service-detail', 'approach', 'contact']

export default function ExpertisePage({ route }) {
  const category = expertise[route.category.id]
  const selected = category.services.find(item => item.id === route.serviceId)
  const [menuOpen, setMenuOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const openContact = (event) => { event?.preventDefault(); setMenuOpen(false); setContactOpen(true) }
  const scrollToFooterContact = (event) => {
    event.preventDefault()
    const button = document.querySelector('#contact .contact-primary-action')
    if (!button) return
    button.focus({ preventScroll: true })
    button.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
  }
  const invalidService = route.serviceId && !selected
  const base = route.category.path
  const closeMenu = () => setMenuOpen(false)
  const { activeSection: currentSection, navigateTo } = useActiveSection(selected ? serviceSectionIds : overviewSectionIds)
  const activeSection = currentSection === 'service-detail' ? 'services' : currentSection
  const menuServices = category.services.map(service => ({ ...service, path: `${base}/${service.id}` }))
  const menuPreviews = {
    home: { image: selected?.image || category.image, alt: selected?.alt || category.alt, label: 'Home' },
    'expertise-main': { image: category.image, alt: category.alt, label: 'Home' },
    services: { image: category.sceneImage, alt: category.sceneAlt, label: 'Services' },
    approach: { image: '/assets/home-rammed-earth-interior.jpeg', alt: 'Warm interior with a circular opening and garden views', label: 'Our approach' },
    contact: { image: category.image, alt: category.alt, label: 'Contact' },
    ...Object.fromEntries(menuServices.map(service => [service.id, { image: service.image, alt: service.alt, label: service.title }])),
  }
  const navigateFromMenu = (id) => {
    if (id === 'contact') setContactOpen(true)
    else if (id === 'choose') window.location.assign('/')
    else if (id === 'expertise-main' && selected) window.location.assign(base)
    else navigateTo(id === 'services' && selected ? 'service-detail' : id)
  }
  const navigateFromHeader = (event, id) => {
    closeMenu()
    if (selected && id !== 'approach') return
    event.preventDefault()
    navigateTo(id)
    window.history.replaceState(null, '', id === 'expertise-main' ? base : `#${id}`)
  }
  const heroHeading = selected ? [selected.title] : category.heading
  useEffect(() => {
    if (['#enquire', '#contact'].includes(window.location.hash)) { setContactOpen(true); return }
    if (!window.location.hash) return
    const frame = requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'auto' }))
    return () => cancelAnimationFrame(frame)
  }, [])
  return <><div className={`expertise-page expertise-page--${route.category.id}`} data-modal-background>
    <a className="expertise-skip" href="#expertise-main">Skip to content</a>
    <header className="expertise-header">
      <a className="expertise-brand" href="/" aria-label="Ferhan — choose a service"><BrandMark descriptor={category.label} label={`Ferhan ${category.label}`} /></a>
      <nav aria-label="Primary navigation" className="expertise-nav">
        <a href={base} aria-current={activeSection === 'expertise-main' ? 'location' : undefined} onClick={event => navigateFromHeader(event, 'expertise-main')}>Overview</a>
        <a href={selected ? `${base}#services` : '#services'} aria-current={activeSection === 'services' ? 'location' : undefined} onClick={event => navigateFromHeader(event, 'services')}>Services</a>
        <a href="#approach" aria-current={activeSection === 'approach' ? 'location' : undefined} onClick={event => navigateFromHeader(event, 'approach')}>Our approach</a>
        <a href="/projects">Projects</a>
        <ServicePathDropdown activePath={route.category.id} />
      </nav>
      <div className="header-controls">
      <HeaderContactButton onClick={openContact} />
      <motion.button className={`menu-toggle expertise-menu-toggle ${menuOpen ? 'is-open' : ''}`} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen(!menuOpen)} whileTap={{ scale: 0.9 }}><i /><i /></motion.button>
      </div>
    </header>
    <main id="expertise-main">
      {invalidService ? <section className="expertise-not-found"><p className="expertise-kicker">Page not found</p><h1>This service could not be found.</h1><a className="expertise-button" href={base}>Explore {category.label}<ArrowUpRight /></a></section> : <>
      {selected ? <section className="expertise-hero">
        <img className="expertise-hero__image" src={selected?.image || category.image} alt={selected?.alt || category.alt} fetchPriority="high" />
        <div className="expertise-hero__shade" />
        <motion.div className="expertise-hero__content" {...reveal}>
          <a className="expertise-back" href={selected ? base : '/'}><span className="expertise-back__icon" aria-hidden="true"><ArrowLeft size={22} strokeWidth={2} /></span><span>{selected ? `All ${category.label.toLowerCase()} services` : 'Three paths. One Ferhan.'}</span></a>
          <p className="expertise-kicker">{category.eyebrow}</p>
          <h1>{heroHeading.map((line, i) => <span key={line} className={i === 1 ? 'accent' : ''}>{line}</span>)}</h1>
          <p className="expertise-hero__intro">{selected?.short || category.intro}</p>
          <a className="expertise-button expertise-hero-action" href={selected ? '#service-detail' : '#services'}><span>{selected ? 'Explore this service' : 'Discover our services'}</span><span className="expertise-hero-action__icon" aria-hidden="true"><ArrowDown size={24} strokeWidth={2} /></span></a>
        </motion.div>
        <div className="expertise-hero__bottom"><span>Perth, Western Australia</span><span>{selected ? 'Specialist expertise' : `${String(category.services.length).padStart(2, '0')} specialist services`}<span className="expertise-dot" /></span></div>
      </section> : <section className="scroll-expand-hero expertise-opening studio-intro-hero" aria-label={`Ferhan ${category.label} introduction`}>
        <ScrollExpand
          className="scroll-expand-root"
          src={category.image}
          alt={category.alt}
          title={<h1 className="hero-tech-heading"><InlineTechText text={category.heroTitle} reveal="area" selection={false} labels={false} draggable={false} sweep={false} specks={0} strokeWidth={1} /></h1>}
          scrollHint="Scroll to expand"
          useWindowScroll startWidth={54} startHeight={62} startRadius={18} endRadius={0}
          mediaZoom={1.12} scrollDistance={1.05} holdDistance={0.24} smoothing={0.16} overlayScrim={0.58} enabled
        >
          <div className="scroll-expand-content studio-intro-copy">
            <p>{category.eyebrow}</p>
            <h2>{category.heading.map(line => <span key={line}>{line}</span>)}</h2>
            <span>{category.intro}</span>
            <button className="studio-explore-button" type="button" onClick={() => navigateTo('services')}><span>Discover our services</span><span className="studio-explore-button__icon" aria-hidden="true"><ArrowDown size={24} strokeWidth={2} /></span></button>
          </div>
        </ScrollExpand>
      </section>}
      {selected ? <section className="expertise-section expertise-detail" id="service-detail">
        <motion.div className="expertise-section-heading" {...reveal}><p className="expertise-kicker">The service</p><h2>{selected.title}</h2></motion.div>
        <div className="expertise-detail__grid"><img src={selected.image} alt={selected.alt} loading="lazy" /><div><p>{selected.description}</p>{selected.note && <p className="expertise-note">{selected.note}</p>}<ul>{selected.points.map(point => <li key={point}><Check size={17} />{point}</li>)}</ul>{route.category.id === 'developments' && <p className="expertise-note">Detailed service information is being finalised. Enquire to discuss scope and current availability.</p>}<a className="expertise-button expertise-detail-action" href="#contact" onClick={scrollToFooterContact}><span>Enquire about this service</span><span className="expertise-hero-action__icon" aria-hidden="true"><ArrowRight size={24} strokeWidth={2} /></span></a></div></div>
        <h3 className="expertise-process-title">How it works</h3><Process steps={selected.steps} />
      </section> : <section className="expertise-services content-section services-section" id="services">
        <div className="section-shell">
          <SectionHeading eyebrow={`What we do / ${String(category.services.length).padStart(2, '0')}`} title={category.sectionHeading}><p>{category.sectionIntro}</p></SectionHeading>
          <motion.div className="service-grid expertise-service-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {category.services.map((service, index) => <motion.a variants={fadeUp} whileTap={{ scale: 0.99 }} className="service-card expertise-service-card" href={`${base}/${service.id}`} key={service.id}>
              <img src={service.image} alt={service.alt} loading="lazy" />
              <span className="card-shade" />
              {route.category.id !== 'developments' && <span className="expertise-service-card__number">0{index + 1} / {String(category.services.length).padStart(2, '0')}</span>}
              <span className="card-content">{route.category.id !== 'developments' && <span className="card-type">{category.label}</span>}<strong>{service.title}</strong><span className="expertise-service-card__description">{service.short}</span><span className="card-link">Explore service<ArrowRight size={18} /></span></span>
            </motion.a>)}
          </motion.div>
          {route.category.id === 'developments' && <p className="expertise-availability">Development information is being finalised. Contact us to discuss your site, scope and current availability.</p>}
        </div>
      </section>}
      {!selected && <ScrollExpandScene variant="expertise" src={category.sceneImage} alt={category.sceneAlt} title={category.sceneTitle} eyebrow="Connected expertise" heading={category.sceneHeading} description={category.sceneCopy} actionLabel="Our approach" onAction={() => navigateTo('approach')} />}
      <section className="expertise-approach" id="approach"><motion.div {...reveal}><p className="expertise-kicker">The Ferhan approach</p><h2>{category.approach}</h2><p>{category.approachCopy}</p><a className="expertise-button expertise-approach-action" href="#contact" onClick={scrollToFooterContact}><span>Start with a conversation</span><span className="expertise-hero-action__icon" aria-hidden="true"><ArrowRight size={24} strokeWidth={2} /></span></a></motion.div><img src="/assets/home-rammed-earth-interior.jpeg" alt="Warm interior with a circular opening and views to the garden" loading="lazy" /></section>
      {!selected && <ServiceExplorer key={route.category.id} category={category} base={base} onOpenContact={openContact} />}
      </>}
    </main>
    <SiteFooter activePath={route.category.id} onOpenContact={openContact} />
  </div><MenuOverlay isOpen={menuOpen} activeSection={activeSection} onClose={closeMenu} onNavigate={navigateFromMenu} items={menuItems} services={menuServices} previews={menuPreviews} descriptor={category.label} projectsHref="/projects" /><ContactDialog isOpen={contactOpen} onClose={() => setContactOpen(false)} category={category} selected={selected} /></>
}
function Process({ steps }) { return <ol className="expertise-process">{steps.map(([label, description], i) => <li key={label}><span>0{i + 1}</span><h4>{label}</h4><p>{description}</p></li>)}</ol> }

function ServiceExplorer({ category, base, onOpenContact }) {
  const services = category.services
  const isConsultants = category.label === 'Consultants' 
  const [expandedId, setExpandedId] = useState(services[0].id)
  const [previewId, setPreviewId] = useState(services[0].id)
  const preview = services.find(service => service.id === previewId)
  const previewIndex = services.findIndex(service => service.id === previewId)

  return <section className="expertise-section expertise-explained development-explorer" aria-labelledby="development-explorer-heading">
    <motion.div className="development-explorer__heading" {...reveal}>
      <div><p className="expertise-kicker">A closer look</p><h2 id="development-explorer-heading">{isConsultants ? <>Know what<br /><span>to expect.</span></> : <>Find your<br /><span>starting point.</span></>}</h2></div>
      <p>{isConsultants ? 'Clear advice starts with understanding your project. Explore our specialist services and see what each step involves.' : 'Every site holds a different possibility. Explore the service that fits your vision, and see where we can take it together.'}</p>
    </motion.div>
    <div className="development-explorer__grid">
      <div className="development-explorer__visual">
        <motion.img key={preview.id} src={preview.image} alt={preview.alt} loading="lazy" initial={{ opacity: 0.6, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55 }} />
        <span className="development-explorer__image-label">{isConsultants ? 'Independent insight. Confident decisions.' : 'Considered places. Lasting value.'}</span>
        <div className="development-explorer__caption"><span>{String(previewIndex + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}</span><p>{preview.short}</p><div className="development-explorer__progress" aria-hidden="true">{services.map(service => <i key={service.id} className={preview.id === service.id ? 'is-active' : ''} />)}</div></div>
      </div>
      <div className="development-explorer__services">
        {services.map((service, index) => {
          const expanded = expandedId === service.id
          return <div className={`development-explorer__item ${expanded ? 'is-open' : ''}`} key={service.id}>
            <h3><button type="button" aria-expanded={expanded} aria-controls={`explorer-panel-${service.id}`} id={`explorer-trigger-${service.id}`} onClick={() => { setPreviewId(service.id); setExpandedId(expanded ? null : service.id) }}>
              <span className="development-explorer__number">{String(index + 1).padStart(2, '0')}</span><span>{service.title}</span><span className="development-explorer__toggle" aria-hidden="true"><Plus size={18} /></span>
            </button></h3>
            <div className="development-explorer__panel" id={`explorer-panel-${service.id}`} role="region" aria-labelledby={`explorer-trigger-${service.id}`} hidden={!expanded}>
              <p>{service.description}</p>
              {service.note && <p className="expertise-note">{service.note}</p>}
              <ol className="development-explorer__steps">{service.steps.map(([label, description], step) => <li key={label}><span>{String(step + 1).padStart(2, '0')}</span><div><h4>{label}</h4><p>{description}</p></div></li>)}</ol>
              <a className="footer-bottom__top development-explorer__link" href={`${base}/${service.id}`}>Explore this service<ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
        })}
        <p className="development-explorer__help">{isConsultants ? 'Unsure which service your project needs? ' : 'Have a site, but unsure where to begin? '}<a href="#contact" onClick={onOpenContact}>Let’s talk <ArrowUpRight size={14} aria-hidden="true" /></a></p>
      </div>
    </div>
  </section>
}

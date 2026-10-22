import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { BrandMark } from '../components/shared/BrandMark'
import ProjectCard from '../components/shared/ProjectCard'
import SiteFooter from '../components/layout/SiteFooter'
import MenuOverlay from '../components/layout/MenuOverlay'
import ServicePathDropdown from '../components/layout/ServicePathDropdown'
import HeaderContactButton from '../components/layout/HeaderContactButton'
import HeaderBackButton from '../components/layout/HeaderBackButton'
import ContactDialog from '../components/dialogs/ContactDialog'
import { visibleProjects, projectCategories, categoryLabel } from '../data/projects'
import '../styles/projects.css'

const readCategory = () => {
  const value = new URLSearchParams(window.location.search).get('category')
  return projectCategories.some(item => item.id === value) ? value : 'all'
}
const projectFamily = category => ['commercial-projects', 'commercial-fit-outs'].includes(category) ? 'commercial' : 'residential'
const revealEase = [0.22, 1, 0.36, 1]

function ProjectIntro({ project }) {
  const reduceMotion = useReducedMotion()
  const reveal = delay => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : delay, ease: revealEase },
  })
  return <div className={`projects-intro${project ? ' project-intro' : ''}`}>
    <motion.p className="projects-kicker" {...reveal(0.05)}>{project ? categoryLabel(project.category) : 'The Ferhan collection'}</motion.p>
    <motion.h1 {...reveal(0.14)}>{project ? project.title : <>Spaces with a distinct <br />sense of place.</>}</motion.h1>
    <motion.p {...reveal(0.26)}>{project ? project.summary : 'Explore architecture, interiors and developments. Find a perspective that connects with your own.'}</motion.p>
  </div>
}

function ProjectGallery({ project }) {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  function goTo(index) {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: index * track.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <section className="project-gallery" aria-label={`${project.title} images`} aria-roledescription="carousel">
    <div className="project-gallery__track" ref={trackRef} tabIndex={0} aria-label="Project images. Swipe or use arrow keys to browse." onScroll={() => setActive(Math.round(trackRef.current.scrollLeft / trackRef.current.clientWidth))} onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
      event.preventDefault()
      goTo(event.key === 'Home' ? 0 : event.key === 'End' ? project.images.length - 1 : Math.max(0, Math.min(project.images.length - 1, active + (event.key === 'ArrowRight' ? 1 : -1))))
    }}>
      {project.images.map((image, index) => <figure key={image.src} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${project.images.length}`}><img src={image.src} alt={image.alt} loading={index === 0 ? 'eager' : 'lazy'} /><figcaption>{image.alt}</figcaption></figure>)}
    </div>
    <div className="project-gallery__bar"><button aria-label="Previous image" disabled={active === 0} onClick={() => goTo(active - 1)}><ArrowLeft size={20} /></button><span aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, '0')} / {String(project.images.length).padStart(2, '0')}</span><button aria-label="Next image" disabled={active === project.images.length - 1} onClick={() => goTo(active + 1)}><ArrowRight size={20} /></button></div>
    <div className="project-gallery__thumbnails">{project.images.map((image, index) => <button key={image.src} onClick={() => goTo(index)} aria-label={`View image ${index + 1}: ${image.alt}`} aria-current={index === active ? 'true' : undefined}><img src={image.src} alt="" loading="lazy" /></button>)}</div>
  </section>
}

export default function ProjectsPage({ projectId }) {
  const reduceMotion = useReducedMotion()
  const [category, setCategory] = useState(readCategory)
  const [contactOpen, setContactOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const project = visibleProjects.find(item => item.id === projectId)
  const filtered = visibleProjects.filter(item => category === 'all' || item.category === category)
  const related = project ? visibleProjects.filter(item => item.id !== project.id && projectFamily(item.category) === projectFamily(project.category)).sort((a, b) => Number(b.category === project.category) - Number(a.category === project.category)).slice(0, 3) : []
  useEffect(() => {
    const onBack = () => setCategory(readCategory())
    window.addEventListener('popstate', onBack)
    return () => window.removeEventListener('popstate', onBack)
  }, [])
  function filter(value) {
    setCategory(value)
    const url = new URL(window.location.href)
    if (value === 'all') url.searchParams.delete('category')
    else url.searchParams.set('category', value)
    window.history.replaceState(null, '', url)
  }
  function navigate(id) {
    setMenuOpen(false)
    if (id === 'contact') setContactOpen(true)
    else window.location.assign(id === 'projects' ? '/projects' : '/')
  }
  return <><div className="projects-page" data-modal-background>
    <a className="projects-skip" href="#projects-main">Skip to content</a>
    <header className="projects-header">
      <a href="/" aria-label="Ferhan — choose a service"><BrandMark descriptor="Projects" label="Ferhan Projects" /></a>
      <nav aria-label="Primary navigation"><HeaderBackButton fallback={projectId ? '/projects' : '/'} /><a href="/projects" aria-current={!projectId ? 'page' : undefined}>Projects</a><ServicePathDropdown /></nav>
      <div className="header-controls">
        <HeaderContactButton onClick={() => { setMenuOpen(false); setContactOpen(true) }} />
        <button className={`menu-toggle projects-menu-toggle ${menuOpen ? 'is-open' : ''}`} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </div>
    </header>
    <main id="projects-main" className="projects-main">
      {projectId && !project ? <section className="projects-empty"><p>Project unavailable</p><h1>This project could not be found.</h1><a className="projects-text-link" href="/projects">Explore all projects<ArrowRight size={18} /></a></section> : project ? <>
        <a className="projects-back" href={`/projects${category !== 'all' ? `?category=${category}` : ''}`} aria-label="Back to all projects" title="All projects"><ArrowLeft size={20} aria-hidden="true" /></a>
        <ProjectIntro project={project} />
        <ProjectGallery project={project} />
        <div className="project-story"><h2>The idea behind the space.</h2><div><p>{project.description}</p><button className="projects-text-link" onClick={() => setContactOpen(true)} aria-haspopup="dialog">Discuss your project<ArrowUpRight size={18} /></button></div></div>
        {related.length > 0 && <section className="project-related" aria-labelledby="related-title"><p className="projects-kicker">Continue exploring</p><h2 id="related-title">Similar projects.</h2><div className="projects-grid">{related.map((item, index) => <ProjectCard key={item.id} project={item} category={category} index={index} />)}</div></section>}
      </> : <>
        <ProjectIntro />
        <LayoutGroup id="project-categories">
          <motion.div className="project-filters" role="group" aria-label="Filter projects by category" initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.35, ease: revealEase }}>
            {[{ id: 'all', label: 'All projects' }, ...projectCategories].map(item => <motion.button key={item.id} onClick={() => filter(item.id)} aria-pressed={category === item.id} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>
              {category === item.id && <motion.span className="project-filter__active" layoutId="active-category" aria-hidden="true" transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }} />}
              <span className="project-filter__label">{item.label}</span>
            </motion.button>)}
          </motion.div>
        </LayoutGroup>
        <p className="projects-count" role="status">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}{category !== 'all' ? ` · ${categoryLabel(category)}` : ''}</p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={category} initial={{ opacity: reduceMotion ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: reduceMotion ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.16 }}>
            {filtered.length ? <div className="projects-grid">{filtered.map((item, index) => <ProjectCard key={item.id} project={item} category={category} index={index} />)}</div> : <div className="projects-empty"><h2>Project stories are being prepared.</h2><p>Tell us what you have in mind and we can discuss relevant work.</p><button className="projects-text-link" onClick={() => setContactOpen(true)}>Start a conversation<ArrowUpRight size={18} /></button></div>}
          </motion.div>
        </AnimatePresence>
      </>}
    </main>
    <SiteFooter activePath={null} onOpenContact={() => setContactOpen(true)} />
  </div><MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={navigate} activeSection="projects" descriptor="Projects" items={[{id:'home',label:'Home'},{id:'services',label:'Services'},{id:'projects',label:'Projects'},{id:'contact',label:'Contact'}]} /><ContactDialog isOpen={contactOpen} onClose={() => setContactOpen(false)} /></>
}

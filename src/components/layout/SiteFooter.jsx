import { ArrowUp } from 'lucide-react'
import { ContactSection } from '../sections/ContactSection'
import TestimonialsSection from '../sections/TestimonialsSection'
import { servicePaths } from '../../data/servicePaths'
import './SiteFooter.css'

export default function SiteFooter({ onNavigate, onOpenContact, activePath = 'architects-builders' }) {
  const backToTop = () => {
    if (onNavigate) onNavigate('home')
    else window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  return (
    <>
    <TestimonialsSection />
    <footer className="site-footer">
      <ContactSection onOpenContact={onOpenContact} />
      <div className="footer-bottom">
        <nav className="footer-bottom__links" aria-label="Footer navigation">
          {servicePaths.map(service => <a key={service.id} href={service.path} aria-current={activePath === service.id ? 'page' : undefined}>{service.title}</a>)}
          <a href="/projects" aria-current={window.location.pathname.startsWith('/projects') ? 'page' : undefined}>Projects</a>
        </nav>
        <div className="footer-bottom__meta">
          <div><span>© {new Date().getFullYear()} Ferhan</span><span>Perth, Western Australia</span></div>
          <button className="footer-bottom__top footer-bottom__top--filled" type="button" onClick={backToTop}>Back to top<span className="footer-bottom__top-icon" aria-hidden="true"><ArrowUp size={24} /></span></button>
        </div>
      </div>
    </footer>
    </>
  )
}

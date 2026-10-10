import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { BrandMark } from '../shared/BrandMark'
import { navigation } from '../../data/navigation'
import { servicePaths } from '../../data/servicePaths'

export default function Header({
  activeSection,
  isMenuOpen,
  isScrolled,
  onMenuToggle,
  onNavigate,
  onChoosePath,
}) {
  const [servicesOpen, setServicesOpen] = useState(false)

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <button className="brand-button" onClick={onChoosePath} aria-label="Choose a service path">
        <BrandMark />
      </button>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => {
          const isActive = activeSection === item.id
          if (item.id === 'services') {
            return (
              <div
                className="nav-services"
                key={item.id}
                onPointerEnter={() => setServicesOpen(true)}
                onPointerLeave={() => setServicesOpen(false)}
                onFocus={() => setServicesOpen(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setServicesOpen(false)
                }}
              >
                <motion.button
                  className={`nav-link nav-services__trigger ${isActive ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => setServicesOpen(true)}
                  whileTap={{ scale: 0.97 }}
                  aria-expanded={servicesOpen}
                  aria-controls="desktop-service-paths"
                >
                  {item.label}<ChevronDown aria-hidden="true" />
                  {isActive && <motion.span className="nav-indicator" layoutId="active-nav-indicator" transition={{ type: 'spring', stiffness: 430, damping: 34 }} />}
                </motion.button>
                <div className="nav-services__menu" id="desktop-service-paths" aria-label="Service paths" hidden={!servicesOpen}>
                  {servicePaths.map((service) => (
                    <a key={service.id} href={service.path} aria-current={window.location.pathname === service.path ? 'page' : undefined}>
                      <span>{service.title}</span>
                      {!service.available && <small>Coming soon</small>}
                    </a>
                  ))}
                </div>
              </div>
            )
          }
          return (
            <motion.button
              key={item.id}
              className={`nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
              whileTap={{ scale: 0.97 }}
              aria-current={isActive ? 'location' : undefined}
            >
              {item.label}
              {isActive && <motion.span className="nav-indicator" layoutId="active-nav-indicator" transition={{ type: 'spring', stiffness: 430, damping: 34 }} />}
            </motion.button>
          )
        })}
      </nav>

      <div className="header-controls">
        <motion.button
          className={`menu-toggle ${isMenuOpen ? 'is-open' : ''}`}
          onClick={onMenuToggle}
          aria-expanded={isMenuOpen}
          aria-controls="site-menu"
          whileTap={{ scale: 0.9 }}
        >
          <span className="sr-only">{isMenuOpen ? 'Close navigation' : 'Open navigation'}</span>
          <i />
          <i />
        </motion.button>
      </div>
    </header>
  )
}

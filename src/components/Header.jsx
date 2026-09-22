import { motion } from 'framer-motion'
import { BrandMark } from './BrandMark'
import { navigation } from '../data/navigation'

export default function Header({
  activeSection,
  isMenuOpen,
  isScrolled,
  onMenuToggle,
  onNavigate,
}) {
  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <button className="brand-button" onClick={() => onNavigate('home')} aria-label="Return to home section">
        <BrandMark />
      </button>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => {
          const isActive = activeSection === item.id
          return (
            <motion.button
              key={item.id}
              className={`nav-link ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
              whileHover={{ y: -2 }}
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

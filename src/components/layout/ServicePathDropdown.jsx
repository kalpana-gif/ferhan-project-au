import { useEffect, useRef } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { servicePaths } from '../../data/servicePaths'
import './ServicePathDropdown.css'

const captions = {
  'architects-builders': 'Architecture, interiors & construction',
  developments: 'From possibility to place',
  consultants: 'Clarity for your next step',
}

export default function ServicePathDropdown({ activePath }) {
  const dropdownRef = useRef(null)
  useEffect(() => {
    const dismiss = event => {
      if (!dropdownRef.current?.contains(event.target)) dropdownRef.current?.removeAttribute('open')
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [])

  return <details className="service-path-dropdown" ref={dropdownRef} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.removeAttribute('open')
  }} onKeyDown={event => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.currentTarget.removeAttribute('open')
      event.currentTarget.querySelector('summary').focus()
    }
  }}>
    <summary>Explore Ferhan<ChevronDown size={14} aria-hidden="true" /></summary>
    <div className="service-path-dropdown__menu">
      <p className="service-path-dropdown__eyebrow">Three paths. One Ferhan.</p>
      {servicePaths.map(item => <a href={item.path} key={item.id} aria-current={item.id === activePath ? 'page' : undefined}>
        <img src={item.image} alt="" />
        <span className="service-path-dropdown__copy"><strong>{item.title}</strong><span>{captions[item.id]}</span></span>
        {item.id === activePath && <span className="service-path-dropdown__icon"><Check size={15} aria-hidden="true" /><span className="sr-only">Current service area</span></span>}
      </a>)}
    </div>
  </details>
}

export function BrandMark({ className = '' }) {
  return (
    <span className={`brand-mark ${className}`} role="img" aria-label="Farhan Architects">
      <span className="brand-mark__name">Farhan</span>
      <span className="brand-mark__descriptor">Architects</span>
    </span>
  )
}

export function ArrowIcon({ direction = 'right' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`arrow-icon arrow-icon--${direction}`}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="close-icon">
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  )
}

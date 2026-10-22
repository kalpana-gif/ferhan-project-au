export function BrandSymbol({ className = '' }) {
  return (
    <svg className={`brand-mark__symbol ${className}`.trim()} viewBox="0 0 88 88" fill="currentColor" aria-hidden="true" focusable="false">
      <rect width="88" height="88" rx="16" />
      <g className="brand-mark__letter" transform="translate(17 20) scale(.84375)">
        <path d="M0 0h64v16H25v6h33v14H0Z" />
        <path d="M0 40h25v16H0Z" />
      </g>
    </svg>
  )
}

export function BrandMark({ className = '', descriptor = 'Architects', label = 'Ferhan Architects' }) {
  return (
    <span className={`brand-mark ${className.includes('brand-mark--ferhan') ? '' : 'brand-mark--service'} ${className}`.trim()} role="img" aria-label={label}>
      <BrandSymbol />
      <span className="brand-mark__descriptor">{descriptor}</span>
    </span>
  )
}

export function ArrowIcon({ direction = 'right' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`arrow-icon arrow-icon--${direction}`}>
      <path d={direction === 'left' ? 'M20 12H4m6-6-6 6 6 6' : 'M4 12h15M13 6l6 6-6 6'} />
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

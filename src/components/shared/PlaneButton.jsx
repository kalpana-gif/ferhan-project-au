export default function PlaneButton({ label, icon = 'send', sending = false, className = '', ...props }) {
  return (
    <button className={`plane-button ${className}${sending ? ' is-sending' : ''}`} aria-label={sending ? 'Sending enquiry' : label} {...props}>
      <span className="plane-button__icon" aria-hidden="true">
        {icon === 'message' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 16a2 2 0 0 1-2 2H8l-5 3V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
            <path d="M7 9h9M7 13h6" />
          </svg>
        ) : <svg viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="M14.22 21.63c-1.18 0-2.85-.83-4.17-4.8l-.72-2.16-2.16-.72c-3.96-1.32-4.79-2.99-4.79-4.17 0-1.17.83-2.85 4.79-4.18l8.49-2.83c2.12-.71 3.89-.5 4.98.58s1.3 2.86.59 4.98l-2.83 8.49c-1.33 3.98-3 4.81-4.18 4.81ZM7.64 7.03c-2.78.93-3.77 2.03-3.77 2.75s.99 1.82 3.77 2.74l2.52.84c.22.07.4.25.47.47l.84 2.52c.92 2.78 2.03 3.77 2.75 3.77s1.82-.99 2.75-3.77l2.83-8.49c.51-1.54.42-2.8-.23-3.45s-1.91-.73-3.44-.22L7.64 7.03Z" />
          <path fill="currentColor" d="M10.11 14.4a.75.75 0 0 1-.53-1.28l3.58-3.59a.75.75 0 0 1 1.06 1.06l-3.58 3.59a.75.75 0 0 1-.53.22Z" />
        </svg>}
      </span>
      {sending ? <span className="plane-button__sending">Sending…</span> : (
        <span className="plane-button__letters" aria-hidden="true">
          {label}
        </span>
      )}
    </button>
  )
}

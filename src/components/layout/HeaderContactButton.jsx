import './HeaderContactButton.css'

export default function HeaderContactButton({ onClick }) {
  return (
    <button className="header-contact-button" onClick={onClick} aria-label="Start a conversation" aria-haspopup="dialog" title="Start a conversation">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 3H20A5 5 0 0 1 25 8V17A5 5 0 0 1 20 22H18V26L13.5 22H8A5 5 0 0 1 3 17V8A5 5 0 0 1 8 3Z" />
        <circle cx="9" cy="12.5" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="14" cy="12.5" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12.5" r="1.25" fill="currentColor" stroke="none" />
      </svg>
    </button>
  )
}

export default function SiteFooter({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <span>© Farhan Architects</span>
        <span>Perth, Western Australia</span>
        <button className="footer-back-top" type="button" onClick={() => onNavigate('home')}>
          <span className="footer-back-top__label">Back to top</span>
          <span className="footer-back-top__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M12 20V4m-6 6 6-6 6 6" /></svg>
          </span>
        </button>
      </div>
    </footer>
  )
}

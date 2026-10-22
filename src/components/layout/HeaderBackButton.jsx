import { ArrowLeft } from 'lucide-react'
import './HeaderBackButton.css'

export default function HeaderBackButton({ fallback = '/' }) {
  function goBack() {
    if (window.history.length > 1) window.history.back()
    else window.location.assign(fallback)
  }

  return <button type="button" className="header-back-button" onClick={goBack} aria-label="Go back to the previous page">
    <ArrowLeft size={15} aria-hidden="true" />
    <span>Back</span>
  </button>
}

import { createContext, useContext, useRef, useState } from 'react'
import { Info, X } from 'lucide-react'
import { useModalA11y } from '../../hooks/useModalA11y'
import './DesignPreview.css'

const PreviewContext = createContext(null)

export function DesignPreviewButton({ className = '' }) {
  const open = useContext(PreviewContext)
  return <button type="button" className={`design-preview-trigger ${className}`} onClick={open} aria-haspopup="dialog"><Info size={13} aria-hidden="true" />Design preview</button>
}

export default function DesignPreviewProvider({ children }) {
  const [isOpen, setOpen] = useState(false)
  const dialogRef = useRef(null)
  const close = () => setOpen(false)
  useModalA11y(isOpen, dialogRef, close)
  return <PreviewContext.Provider value={() => setOpen(true)}>{children}
    {isOpen && <div className="design-preview-backdrop" onMouseDown={event => event.target === event.currentTarget && close()}>
      <section className="design-preview-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="preview-title" aria-describedby="preview-description">
        <button className="design-preview-close" onClick={close} data-modal-autofocus aria-label="Close design preview"><X size={20} /></button>
        <Info className="design-preview-icon" size={28} aria-hidden="true" />
        <h2 id="preview-title">About this design preview.</h2>
        <div id="preview-description"><p>Project names, descriptions and image collections are sample content used to preview the website. Reference images may show different spaces and are not a record of one completed project.</p><p>Testimonials use sample wording and attribution, rather than actual client reviews.</p><p>Approved project photography, stories and client quotes will replace these samples. Preview content is hidden on the public production site until approved.</p></div>
        <button className="design-preview-done" onClick={close}>Continue exploring</button>
      </section>
    </div>}
  </PreviewContext.Provider>
}

import { useEffect, useRef } from 'react'

const focusableSelector = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const getFocusableElements = (container) => {
  if (!container) return []

  return [...container.querySelectorAll(focusableSelector)].filter(
    (element) => !element.hasAttribute('inert') && element.getClientRects().length > 0,
  )
}

/**
 * Keeps every overlay behaving like a true modal: its controls remain in the
 * keyboard loop, the page behind it is unavailable, and focus returns to the
 * trigger when it closes.
 */
export function useModalA11y(isOpen, dialogRef, onClose) {
  const openerRef = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const app = document.querySelector('.app')
    const wasInert = app?.hasAttribute('inert')
    const previousAriaHidden = app?.getAttribute('aria-hidden')
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    app?.setAttribute('inert', '')
    app?.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    const focusInitialControl = () => {
      const dialog = dialogRef.current
      if (!dialog) return
      const initialControl = dialog.querySelector('[data-modal-autofocus]') || getFocusableElements(dialog)[0]
      initialControl?.focus({ preventScroll: true })
    }

    const focusFrame = window.requestAnimationFrame(focusInitialControl)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current?.()
        return
      }

      if (event.key !== 'Tab') return

      const dialog = dialogRef.current
      const focusable = getFocusableElements(dialog)
      if (!focusable.length) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && (activeElement === first || !dialog.contains(activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (activeElement === last || !dialog.contains(activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight

      if (app) {
        if (wasInert) app.setAttribute('inert', '')
        else app.removeAttribute('inert')

        if (previousAriaHidden === null) app.removeAttribute('aria-hidden')
        else app.setAttribute('aria-hidden', previousAriaHidden)
      }

      openerRef.current?.focus({ preventScroll: true })
    }
  }, [dialogRef, isOpen])
}

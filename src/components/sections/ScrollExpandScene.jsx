import ScrollExpand from '../effects/ScrollExpand'
import { ArrowRight } from 'lucide-react'
import './ScrollExpandScene.css'

/**
 * A compact, full-viewport ScrollExpand chapter used to give the long-form
 * page a moment of pause between its editorial sections.
 */
export default function ScrollExpandScene({
  variant,
  src,
  alt,
  title,
  eyebrow,
  heading,
  description,
  actionLabel,
  onAction,
  scrollHint = 'Scroll to reveal',
  startWidth = 48,
  startHeight = 60,
  startRadius = 22,
  endRadius = 0,
  mediaZoom = 1.2,
  scrollDistance = 0.78,
  holdDistance = 0.2,
  overlayScrim = 0.55,
}) {
  const sceneHeight = `${(1 + scrollDistance + holdDistance) * 100}svh`

  return (
    <section
      className={`scroll-expand-scene scroll-expand-scene--${variant}`}
      style={{ '--scroll-expand-scene-height': sceneHeight }}
      aria-label={eyebrow || heading}
    >
      <ScrollExpand
        className="scroll-expand-root"
        src={src}
        alt={alt}
        title={title}
        scrollHint={scrollHint}
        useWindowScroll
        startWidth={startWidth}
        startHeight={startHeight}
        startRadius={startRadius}
        endRadius={endRadius}
        mediaZoom={mediaZoom}
        scrollDistance={scrollDistance}
        holdDistance={holdDistance}
        smoothing={0.1}
        overlayScrim={overlayScrim}
        enabled
      >
        <div className="scroll-expand-scene-content">
          <p>{eyebrow}</p>
          <h2>{heading}</h2>
          <span>{description}</span>
          {actionLabel && onAction && (
            <button className="scene-action-button" type="button" onClick={onAction}>
              <span>{actionLabel}</span><span className="scene-action-button__icon" aria-hidden="true"><ArrowRight size={24} strokeWidth={2} /></span>
            </button>
          )}
        </div>
      </ScrollExpand>
    </section>
  )
}

import ScrollExpand from '../effects/ScrollExpand'
import InlineTechText from '../effects/InlineTechText'

export default function ScrollExpandIntro({ onDiscover }) {
  return (
    <div className="scroll-expand-hero" aria-label="Farhan Architects studio introduction">
      <ScrollExpand
        className="scroll-expand-root"
        src="/assets/home-circular-garden-window-v2.jpeg"
        alt="Rammed earth interior with a circular window opening onto a green garden"
        title={<h1 className="hero-tech-heading"><InlineTechText text="Design matters." reveal="area" selection={false} labels={false} draggable={false} sweep={false} specks={0} strokeWidth={1} /></h1>}
        scrollHint="Scroll to expand"
        useWindowScroll
        startWidth={54}
        startHeight={62}
        startRadius={18}
        endRadius={0}
        mediaZoom={0.72}
        scrollDistance={1.05}
        holdDistance={0.24}
        smoothing={0.16}
        overlayScrim={0.58}
        enabled
      >
        <div className="scroll-expand-content">
          <p>Perth architecture studio</p>
          <h2>Built around <br />the way you live.</h2>
          <span>Architecture, interiors, and spaces with a lasting sense of place.</span>
          <button onClick={onDiscover}>Explore our work <b>↓</b></button>
        </div>
      </ScrollExpand>
    </div>
  )
}

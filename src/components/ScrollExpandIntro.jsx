import ScrollExpand from './ScrollExpand'

export default function ScrollExpandIntro({ onDiscover }) {
  return (
    <div className="scroll-expand-hero" aria-label="Farhan Architects studio introduction">
      <ScrollExpand
        className="scroll-expand-root"
        src="/assets/1-13.jpg"
        alt="A Farhan Architects designed interior with a blue upholstered bench and sculptural stair"
        title="Design matters."
        scrollHint="Scroll to expand"
        useWindowScroll
        startWidth={54}
        startHeight={62}
        startRadius={18}
        endRadius={0}
        mediaZoom={1.22}
        scrollDistance={1.05}
        holdDistance={0.24}
        smoothing={0.1}
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

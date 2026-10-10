import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Globe2, Link2, Mail } from 'lucide-react'
import { fadeUp, stagger } from '../../animations/variants'
import SectionHeading from './SectionHeading'

const teamMembers = [
  {
    name: 'Amelia Hart',
    role: 'Studio Director',
    image: '/assets/team/team-01.webp'
  },
  {
    name: 'Noah Bennett',
    role: 'Senior Architect',
    image: '/assets/team/team-02.webp'
  },
  {
    name: 'Olivia Chen',
    role: 'Interior Designer',
    image: '/assets/team/team-03.webp'
  },
  {
    name: 'Ethan Walker',
    role: 'Project Architect',
    image: '/assets/team/team-04.webp'
  },
  {
    name: 'Maya Patel',
    role: 'Urban Designer',
    image: '/assets/team/team-05.webp'
  },
  {
    name: 'Lucas Morgan',
    role: 'Design Technician',
    image: '/assets/team/team-06.webp'
  }
]

function TeamProfileCard({ member, index, duplicate = false }) {
  return (
    <motion.article
      className="team-profile-card"
      variants={duplicate ? undefined : fadeUp}
    >
      <header className="team-profile-card__header">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3>{member.name}</h3>
          <p>{member.role}</p>
        </div>
      </header>
      <div className="team-profile-card__portrait">
        <img src={member.image} alt={`${member.name}, ${member.role}`} loading="lazy" decoding="async" draggable="false" />
      </div>
      <footer className="team-profile-card__footer">
        <span>Perth, WA</span>
        <div aria-label={`${member.name} social profiles`}>
          <Globe2 aria-hidden="true" />
          <Link2 aria-hidden="true" />
          <Mail aria-hidden="true" />
        </div>
      </footer>
    </motion.article>
  )
}

function TeamTape() {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const setTrackOffset = (nextOffset) => {
    const track = trackRef.current
    const groupWidth = track?.firstElementChild?.getBoundingClientRect().width ?? 0

    if (!track || !groupWidth) return

    let wrappedOffset = nextOffset
    while (wrappedOffset <= -groupWidth) wrappedOffset += groupWidth
    while (wrappedOffset > 0) wrappedOffset -= groupWidth

    offsetRef.current = wrappedOffset
    track.style.transform = `translate3d(${wrappedOffset}px, 0, 0)`
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let previousTime = performance.now()
    let animationFrame

    const moveTape = (time) => {
      const elapsed = Math.min(time - previousTime, 64)
      previousTime = time

      if (!isDraggingRef.current && !reduceMotion.matches) {
        setTrackOffset(offsetRef.current - elapsed * 0.05)
      }

      animationFrame = requestAnimationFrame(moveTape)
    }

    animationFrame = requestAnimationFrame(moveTape)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    isDraggingRef.current = true
    dragStartXRef.current = event.clientX
    dragStartOffsetRef.current = offsetRef.current
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) return
    setTrackOffset(dragStartOffsetRef.current + event.clientX - dragStartXRef.current)
  }

  const finishDragging = (event) => {
    if (!isDraggingRef.current) return

    isDraggingRef.current = false
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <motion.div
      className={`team-roster-viewport ${isDragging ? 'is-dragging' : ''}`}
      aria-label="Farhan Architects team"
      title="Drag to explore the team"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDragging}
      onPointerCancel={finishDragging}
    >
      <div className="team-roster" ref={trackRef}>
        <div className="team-roster__group">
          {teamMembers.map((member, index) => (
            <TeamProfileCard member={member} index={index} key={member.name} />
          ))}
        </div>
        <div className="team-roster__group" aria-hidden="true">
          {teamMembers.map((member, index) => (
            <TeamProfileCard member={member} index={index} key={`${member.name}-duplicate`} duplicate />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function TeamSection() {
  return (
    <section id="team" className="content-section team-section">
      <div className="section-shell team-shell">
        <SectionHeading eyebrow="The team" title="Different disciplines. One point of view.">
          <p>Our architects, interior designers, planners and delivery specialists work as one studio from the first conversation through to the final detail.</p>
        </SectionHeading>
        <TeamTape />
      </div>
    </section>
  )
}

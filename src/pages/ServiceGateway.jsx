import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import { BrandMark } from '../components/shared/BrandMark'
import BorderGlow from '../components/effects/BorderGlow'
import Crosshair from '../components/effects/Crosshair'
import StrokeText from '../components/effects/StrokeText'
import TechText from '../components/effects/TechTextCanvas'
import { gatewayContent } from '../data/gatewayContent'
import { servicePaths } from '../data/servicePaths'
import '../styles/gateway.css'

const desktopPointerQuery = '(min-width: 961px) and (hover: hover) and (pointer: fine)'
const headingWords = gatewayContent.heading.split(' ')
const headingAccent = headingWords.pop() ?? ''
const headingLead = headingWords.join(' ')
const revealEase = [0.22, 1, 0.36, 1]
const pageReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
}
const cardsReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
}
const riseReveal = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: revealEase } },
}
const cardReveal = {
  hidden: { opacity: 0, y: 34, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.82, ease: revealEase } },
}

function useDesktopPointer() {
  const [enabled, setEnabled] = useState(() => window.matchMedia(desktopPointerQuery).matches)

  useEffect(() => {
    const query = window.matchMedia(desktopPointerQuery)
    const update = () => setEnabled(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return enabled
}

function PathCard({ service, index }) {
  return (
    <motion.div className="service-gateway__card-wrap" variants={cardReveal}>
      <BorderGlow
        className="service-gateway__glow"
        edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="#120F17"
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1}
        coneSpread={25}
        animated={false}
        colors={['#c084fc', '#f472b6', '#38bdf8']}
      >
        <a className={`service-gateway__card ${service.available ? '' : 'is-planned'}`} href={service.path}>
          <img src={service.image} alt="" loading="eager" />
          <span className="service-gateway__card-shade" aria-hidden="true" />
          <span className="service-gateway__card-top">
            <span>0{index + 1} / 03</span>
            {!service.available && <span>Coming soon</span>}
          </span>
          <span className="service-gateway__card-bottom">
            <strong>{service.title}</strong>
            <span className="service-gateway__card-description">{service.description}</span>
            <span className="service-gateway__card-action">
              {service.available ? 'Enter site' : 'View future path'}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </span>
        </a>
      </BorderGlow>
    </motion.div>
  )
}

export default function ServiceGateway({ route }) {
  const showCrosshair = useDesktopPointer()
  const reduceMotion = useReducedMotion()
  const pageRef = useRef(null)
  const revealProps = reduceMotion ? {} : { initial: 'hidden', animate: 'visible' }

  if (route.type === 'gateway') {
    return (
      <main ref={pageRef} className="service-gateway">
        {showCrosshair && (
          <Crosshair
            containerRef={pageRef}
            color="#ffffff"
            targetEffect="lock"
            targetSelector=".service-gateway__card"
            thickness={1}
            opacity={0.85}
            smoothing={0.35}
            showCoordinates
            lineStyle="solid"
            blendMode="normal"
            gap={0}
            fade={0}
            clickPulse
            hideCursor={false}
          />
        )}
        <motion.div className="service-gateway__shell" variants={pageReveal} {...revealProps}>
          <motion.header className="service-gateway__header" variants={riseReveal}>
            <BrandMark descriptor={gatewayContent.brandDescriptor} label={gatewayContent.brandLabel} />
            <span>{gatewayContent.location}</span>
          </motion.header>

          <motion.div className="service-gateway__intro" variants={riseReveal}>
            <div>
              <h1 aria-label={gatewayContent.heading}>
                <span className="service-gateway__heading-lead" aria-hidden="true">
                  <StrokeText
                    text={headingLead}
                    className="service-gateway__stroke-heading"
                    strokeColor="#FFFFFF"
                    fillColor="#F8FAFC"
                    strokeWidth={1.4}
                    drawDuration={1.6}
                    fillDelay={0.2}
                    stagger={0.05}
                    ease="power2.out"
                    trigger="mount"
                    fillMode="wipe"
                    fontSize={116}
                    fontWeight={700}
                    fillStrokeWidth={2.4}
                    letterSpacing={-7}
                    reverse={false}
                  />
                </span>
                <span className="service-gateway__heading-accent" aria-hidden="true">
                  <TechText
                    text={headingAccent}
                    fontWeight={600}
                    fontSize={150}
                    reveal="letter"
                    dashLength={4}
                    dashGap={2}
                    specks={15}
                    fontFamily="'Michroma', sans-serif"
                    color="#ffffff"
                    accentColor="#ffffff"
                    letterSpacing={-0.05}
                    reach={200}
                    softness={0.7}
                    strokeWidth={1.5}
                    speed={1}
                    lineStyle="dashed"
                    selection
                    labels
                    draggable
                    sweep
                  />
                  <span className="service-gateway__heading-accent-fallback">{headingAccent}</span>
                </span>
              </h1>
            </div>
            <p>{gatewayContent.introduction}</p>
          </motion.div>

          <motion.nav className="service-gateway__cards" aria-label="Choose a service area" variants={cardsReveal}>
            {servicePaths.map((service, index) => <PathCard key={service.id} service={service} index={index} />)}
          </motion.nav>

          <motion.footer className="service-gateway__footer" variants={riseReveal}>
            <span>{gatewayContent.footerServices}</span>
            <span>{gatewayContent.copyright}</span>
          </motion.footer>
        </motion.div>
      </main>
    )
  }

  const isPlanned = route.type === 'planned'
  return (
    <main className="service-gateway service-gateway--message">
      <motion.div className="service-gateway__shell" variants={pageReveal} {...revealProps}>
        <motion.header className="service-gateway__header" variants={riseReveal}>
          <BrandMark descriptor={gatewayContent.brandDescriptor} label={gatewayContent.brandLabel} />
          <a href="/"><ChevronLeft aria-hidden="true" /> Choose another path</a>
        </motion.header>

        <motion.section className="service-gateway__message" aria-labelledby="service-gateway-message-title" variants={cardsReveal}>
          {isPlanned && <motion.img src={route.category.image} alt="" variants={cardReveal} />}
          <motion.div variants={riseReveal}>
            <p className="service-gateway__eyebrow">{isPlanned ? 'Future service area' : 'Page not found'}</p>
            <h1 id="service-gateway-message-title">{isPlanned ? `${route.category.title} is coming soon.` : 'This path could not be found.'}</h1>
            <p>{isPlanned ? 'This part of the site is being prepared. Choose another path to explore the services available now.' : 'Return to the selection screen to choose a service area.'}</p>
            <a className="service-gateway__return" href="/">Choose a path <ArrowUpRight aria-hidden="true" /></a>
          </motion.div>
        </motion.section>
      </motion.div>
    </main>
  )
}

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import { BrandMark, BrandSymbol } from '../components/shared/BrandMark'
import BorderGlow from '../components/effects/BorderGlow'
import Crosshair from '../components/effects/Crosshair'
import TechText from '../components/effects/InlineTechText'
import StrokeText from '../components/effects/StrokeText'
import ShinyText from '../components/ShinyText'
import { gatewayContent } from '../data/gatewayContent'
import { servicePaths } from '../data/servicePaths'
import '../styles/gateway.css'

const desktopPointerQuery = '(min-width: 961px) and (hover: hover) and (pointer: fine)'
const headingText = gatewayContent.heading.slice(1)
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

function PathCard({ service }) {
  return (
    <motion.div className="service-gateway__card-wrap" variants={cardReveal}>
      <BorderGlow
        className="service-gateway__glow"
        edgeSensitivity={30}
        glowColor="100 70 55"
        backgroundColor="#10170f"
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1}
        coneSpread={25}
        animated={false}
        colors={['#76bb48', '#aada89', '#659133']}
      >
        <a className={`service-gateway__card ${service.available ? '' : 'is-planned'}`} href={service.path}>
          <img src={service.image} alt="" loading="eager" />
          <span className="service-gateway__card-shade" aria-hidden="true" />
          <span className="service-gateway__card-top">
            {!service.available && <span>Coming soon</span>}
          </span>
          <span className="service-gateway__card-bottom">
            <strong>{service.title}</strong>
            <span className="service-gateway__card-description">{service.description}</span>
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
            color="#aada89"
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
            <BrandMark className="brand-mark--ferhan" descriptor={gatewayContent.brandDescriptor} label={gatewayContent.brandLabel} />
            <span>{gatewayContent.location}</span>
          </motion.header>

          <motion.div className="service-gateway__intro" variants={riseReveal}>
            <p className="service-gateway__eyebrow">
              <StrokeText
                text="ONE VISION. THREE AREAS OF EXPERTISE."
                strokeColor="#aada89"
                fillColor="#ffffff"
                strokeStyle="solid"
                strokeWidth={0.6}
                dashLength={10}
                drawDuration={1.6}
                fillDelay={0.2}
                stagger={0.05}
                ease="power2.out"
                trigger="mount"
                fillMode="wipe"
                wipeFrom="left"
                fontSize={16}
                fontWeight={500}
                letterSpacing={1.92}
                marching={false}
                hoverRedraw
                shadow={false}
                fontFamily="Graphik, Helvetica, Arial, sans-serif"
                reverse={false}
              />
            </p>
            <div>
              <h1 aria-label={gatewayContent.heading}>
                <BrandSymbol className="service-gateway__heading-symbol" />
                <span className="service-gateway__heading-accent" aria-hidden="true">
                  <TechText
                    text={headingText}
                    fontWeight={600}
                    reveal="letter"
                    dashLength={4}
                    dashGap={2}
                    specks={8}
                    fontFamily="'Michroma', sans-serif"
                    color="#f8fafc"
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
                </span>
              </h1>
            </div>
            <p>
              <ShinyText
                text={gatewayContent.introduction}
                color="#cdd2c7"
                shineColor="#ffffff"
                speed={2.5}
                delay={1}
                direction="right"
              />
            </p>
          </motion.div>

          <motion.nav className="service-gateway__cards" aria-label="Choose a service area" variants={cardsReveal}>
            {servicePaths.map((service) => <PathCard key={service.id} service={service} />)}
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
          <BrandMark className="brand-mark--ferhan" descriptor={gatewayContent.brandDescriptor} label={gatewayContent.brandLabel} />
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

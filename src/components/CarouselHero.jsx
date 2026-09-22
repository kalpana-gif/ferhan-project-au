import { AnimatePresence, motion } from 'framer-motion'
import { ArrowIcon } from './BrandMark'
import { slides } from '../data/slides'

const modulo = (value, length) => (value + length) % length

const slideTransition = { duration: 0.72, ease: [0.22, 1, 0.36, 1] }

export default function CarouselHero({ activeIndex, isFramed, onIndexChange, onDiscover, onOpenDetail }) {
  const activeSlide = slides[activeIndex]
  const move = (direction) => onIndexChange((index) => modulo(index + direction, slides.length))

  const handleAction = () => {
    if (activeSlide.id === 'home') onDiscover()
    else onOpenDetail(activeSlide)
  }

  return (
    <section className={`carousel showcase-carousel ${isFramed ? 'is-framed' : ''}`} aria-roledescription="carousel" aria-label="Farhan Architects projects">
      <div className="visual-stage" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            className="slide is-active"
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.045 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.016 }}
            transition={slideTransition}
          >
            <motion.img
              src={activeSlide.image}
              alt=""
              className="slide-image"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="image-shade" />
          </motion.article>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="caption"
            key={activeSlide.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="caption-eyebrow">{activeSlide.eyebrow}</p>
            <h1>{activeSlide.title}</h1>
            <p className="caption-description">{activeSlide.description}</p>
            <motion.button className="caption-action" onClick={handleAction} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              {activeSlide.action}<ArrowIcon />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="slide-navigation" aria-label="Carousel navigation">
        <motion.button className="nav-arrow nav-arrow--previous" onClick={() => move(-1)} aria-label="Previous slide" whileHover={{ x: -3 }} whileTap={{ scale: 0.9 }}><ArrowIcon direction="left" /></motion.button>
        <motion.button className="nav-arrow nav-arrow--next" onClick={() => move(1)} aria-label="Next slide" whileHover={{ x: 3 }} whileTap={{ scale: 0.9 }}><ArrowIcon /></motion.button>
      </div>

      <div className="carousel-footer">
        <div className="active-section"><span>{activeSlide.group || 'Studio'}</span></div>
        <div className="counter"><span>{String(activeIndex + 1).padStart(2, '0')}</span><i /><span>{String(slides.length).padStart(2, '0')}</span></div>
        <div className="slide-rail" aria-label="Choose a slide">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => onIndexChange(index)}
              aria-pressed={index === activeIndex}
              aria-label={`Show ${slide.title}, ${slide.eyebrow}`}
            />
          ))}
        </div>
      </div>
      <motion.button className="scroll-prompt" onClick={onDiscover} whileHover={{ y: 3 }} aria-label="Scroll to services">Scroll to explore <span>↓</span></motion.button>
    </section>
  )
}

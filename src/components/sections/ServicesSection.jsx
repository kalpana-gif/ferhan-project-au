import { motion } from 'framer-motion'
import { ArrowIcon } from '../shared/BrandMark'
import { slides } from '../../data/slides'
import { fadeUp, stagger } from '../../animations/variants'
import SectionHeading from './SectionHeading'

const serviceSlides = slides.filter((slide) => slide.group === 'Services')

export function ServicesSection({ onOpenDetail }) {
  return (
    <section id="services" className="content-section services-section">
      <div className="section-shell">
        <SectionHeading eyebrow="What we do" title="A full spectrum of design thinking.">
          <p>From first possibility to the final detail, our Perth studio brings residential, multi-residential and commercial architecture into one considered process.</p>
        </SectionHeading>
        <motion.div className="service-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {serviceSlides.map((slide) => (
            <motion.button
              className="service-card"
              key={slide.id}
              variants={fadeUp}
              onClick={() => onOpenDetail(slide)}
              whileTap={{ scale: 0.99 }}
            >
              <img src={slide.image} alt="" />
              <span className="card-shade" />
              <span className="card-content">
                <span className="card-type">{slide.eyebrow}</span>
                <strong>{slide.title}</strong>
                <span className="card-link">Explore <ArrowIcon /></span>
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

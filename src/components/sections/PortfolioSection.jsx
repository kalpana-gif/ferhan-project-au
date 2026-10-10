import { motion } from 'framer-motion'
import { ArrowIcon } from '../shared/BrandMark'
import { portfolioGroups, slides } from '../../data/slides'
import { fadeUp, stagger } from '../../animations/variants'
import SectionHeading from './SectionHeading'

const portfolioSlides = portfolioGroups.map((group) => slides.find((slide) => slide.id === group.slideId))

export function PortfolioSection({ onOpenDetail }) {
  return (
    <section id="portfolio" className="content-section portfolio-section">
      <div className="section-shell">
        <SectionHeading eyebrow="Selected work" title="Spaces with a distinct sense of place." light>
          <p>Every project balances enduring ideas with the particular character of its site, its people and its moment.</p>
        </SectionHeading>
        <motion.div className="portfolio-list" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {portfolioSlides.map((slide, index) => (
            <motion.article className={`portfolio-feature feature-${index + 1}`} key={slide.id} variants={fadeUp}>
              <motion.button onClick={() => onOpenDetail(slide)} whileTap={{ scale: 0.99 }}>
                <img src={slide.image} alt="" />
                <span className="portfolio-overlay" />
                <span className="portfolio-label"><em>{slide.eyebrow}</em><strong>{slide.title}</strong><i>View project <ArrowIcon /></i></span>
              </motion.button>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

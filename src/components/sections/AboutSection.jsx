import { motion } from 'framer-motion'
import { ArrowIcon } from '../shared/BrandMark'
import { slides } from '../../data/slides'
import { fadeUp, stagger } from '../../animations/variants'

const aboutSlide = slides.find((slide) => slide.id === 'about')

export function AboutSection({ onNavigate }) {
  return (
    <section id="about" className="content-section about-section">
      <div className="about-image" aria-hidden="true"><img src={aboutSlide.image} alt="" /></div>
      <motion.div className="about-content" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.28 }}>
        <motion.p className="section-kicker" variants={fadeUp}>The studio</motion.p>
        <motion.h2 variants={fadeUp}>Design matters when it changes how a place feels.</motion.h2>
        <motion.p variants={fadeUp}>Ferhan Architects is an architecture and design studio based in Perth, Western Australia. Specialising in residential, multi-residential, and commercial architecture since 2007.</motion.p>
        <motion.div className="about-statements" variants={fadeUp}>
          <span>Architecture</span><span>Interiors</span><span>Design &amp; Build</span>
        </motion.div>
        <motion.button className="dark-text-button" onClick={() => onNavigate('contact')} variants={fadeUp}>
          <span>Work with us</span>
          <span className="dark-text-button__icon" aria-hidden="true"><ArrowIcon /></span>
        </motion.button>
      </motion.div>
    </section>
  )
}

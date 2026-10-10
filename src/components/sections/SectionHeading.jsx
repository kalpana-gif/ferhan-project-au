import { motion } from 'framer-motion'
import { fadeUp, stagger } from '../../animations/variants'

export default function SectionHeading({ eyebrow, title, children, light = false }) {
  return (
    <motion.div className={`section-heading ${light ? 'is-light' : ''}`} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
      <motion.p className="section-kicker" variants={fadeUp}>{eyebrow}</motion.p>
      <motion.h2 variants={fadeUp}>{title}</motion.h2>
      {children && <motion.div className="section-copy" variants={fadeUp}>{children}</motion.div>}
    </motion.div>
  )
}

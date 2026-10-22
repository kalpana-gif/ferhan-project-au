import { motion } from 'framer-motion'
import { ArrowIcon } from '../shared/BrandMark'
import { visibleProjects, categoryLabel } from '../../data/projects'
import { fadeUp, stagger } from '../../animations/variants'
import SectionHeading from './SectionHeading'

const portfolioProjects = visibleProjects.slice(0, 3)

export function PortfolioSection() {
  return (
    <section id="portfolio" className="content-section portfolio-section">
      <div className="section-shell">
        <SectionHeading eyebrow="Selected work" title="Spaces with a distinct sense of place." light>
          <p>Every project balances enduring ideas with the particular character of its site, its people and its moment.</p>
        </SectionHeading>
        <motion.div className="portfolio-list" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {portfolioProjects.map((project, index) => (
            <motion.article className={`portfolio-feature feature-${index + 1}`} key={project.id} variants={fadeUp}>
              <motion.a href={`/projects/${project.id}`} whileTap={{ scale: 0.99 }}>
                <img src={project.images[0].src} alt={project.images[0].alt} loading="lazy" />
                <span className="portfolio-overlay" />
                <span className="portfolio-label"><em>{categoryLabel(project.category)}</em><strong>{project.title}</strong><i>View project <ArrowIcon /></i></span>
              </motion.a>
            </motion.article>
          ))}
        </motion.div>
        {!portfolioProjects.length && <p>Project stories are being prepared. Contact us to discuss relevant work.</p>}
        <a className="portfolio-all-link" href="/projects"><span>View all projects</span><span className="portfolio-all-link__icon" aria-hidden="true"><ArrowIcon /></span></a>
      </div>
    </section>
  )
}

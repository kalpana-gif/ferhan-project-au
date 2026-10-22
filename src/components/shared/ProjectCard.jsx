import { motion, useReducedMotion } from 'framer-motion'
import { categoryLabel } from '../../data/projects'

export default function ProjectCard({ project, category = 'all', index = 0 }) {
  const reduceMotion = useReducedMotion()
  return <motion.article className="project-card"
    initial={reduceMotion ? false : { opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}>
    <div className="project-card__image"><a href={`/projects/${project.id}?category=${encodeURIComponent(category)}`} aria-label={`View ${project.title}`}><img src={project.images[0].src} alt={project.images[0].alt} loading="lazy" /></a></div>
    <a href={`/projects/${project.id}?category=${encodeURIComponent(category)}`}>
    <div className="project-card__caption"><p>{categoryLabel(project.category)}</p><h3>{project.title}</h3><span>{project.summary}</span></div>
  </a>
  </motion.article>
}

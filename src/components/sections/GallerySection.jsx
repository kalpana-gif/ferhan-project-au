import { motion } from 'framer-motion'
import AccordionGallery from '../effects/AccordionGallery'
import { fadeUp } from '../../animations/variants'
import SectionHeading from './SectionHeading'

const galleryItems = [
  {
    type: 'image',
    image: '/assets/gallery-exterior-day.jpg',
    alt: 'Modern white home and landscaped garden beneath a soft evening sky',
    label: 'Garden residence'
  },
  {
    type: 'image',
    image: '/assets/gallery-forest-house.jpg',
    alt: 'Contemporary timber and concrete home surrounded by mature trees',
    label: 'Forest edge'
  },
  {
    type: 'video',
    video: '/assets/gallery-feature.mp4',
    poster: '/assets/gallery-exterior-dusk.jpg',
    label: 'Architecture in motion'
  },
  {
    type: 'image',
    image: '/assets/gallery-loft-interior.jpg',
    alt: 'Dark contemporary loft interior with brick, timber and generous windows',
    label: 'Material contrast'
  },
  {
    type: 'image',
    image: '/assets/gallery-exterior-dusk.jpg',
    alt: 'Modern glass-fronted home glowing warmly at dusk',
    label: 'Evening light'
  }
]

export function GallerySection() {
  return (
    <section id="gallery" className="content-section gallery-section">
      <div className="section-shell gallery-shell">
        <SectionHeading eyebrow="Studio gallery" title="A closer look at the details that hold a space together.">
          <p>Move through a selection of moments shaped by light, material and the pleasure of everyday use.</p>
        </SectionHeading>
        <motion.div
          className="gallery-frame"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <AccordionGallery
            className="studio-accordion-gallery"
            items={galleryItems}
            defaultIndex={2}
            accentColor="#ffffff"
            overlayColor="#000000"
            textColor="#ffffff"
            height={600}
            gap={10}
            radius={3}
            expandRatio={0.58}
            duration={0.72}
            ease="power3.inOut"
            parallax={0.34}
            tilt={0}
            trigger="hover"
            grayscale={false}
          />
        </motion.div>
        <motion.div className="gallery-note" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <p>Explore the composition</p>
          <span>Hover, tap or use the arrow keys to expand one frame at a time.</span>
        </motion.div>
      </div>
    </section>
  )
}

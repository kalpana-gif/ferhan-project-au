import { motion } from 'framer-motion'
import { ArrowIcon } from './BrandMark'
import { navigation } from '../data/navigation'
import { fadeUp, stagger } from '../motion'

export default function SiteFooter({ onNavigate, onOpenContact }) {
  return (
    <footer className="site-footer">
      <motion.div
        className="footer-shell"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <motion.div className="footer-intro" variants={fadeUp}>
          <p className="section-kicker">Farhan Architects</p>
          <h2>Good spaces start with a shared point of view.</h2>
          <motion.button className="footer-cta" type="button" onClick={onOpenContact} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
            Start a conversation <ArrowIcon />
          </motion.button>
        </motion.div>

        <motion.div className="footer-grid" variants={stagger}>
          <motion.address className="footer-block footer-address" variants={fadeUp}>
            <span>Visit the studio</span>
            <p>205A Wharf Street<br />Queens Park WA 6107</p>
            <a href="tel:+61402427059">+61 (0) 402 427 059</a>
            <a href="mailto:cf@ferhandesign.com.au">cf@ferhandesign.com.au</a>
          </motion.address>

          <motion.nav className="footer-block footer-nav" aria-label="Footer navigation" variants={fadeUp}>
            <span>Explore</span>
            {navigation.map((item) => (
              <motion.button key={item.id} type="button" onClick={() => onNavigate(item.id)} whileHover={{ x: 4 }}>
                {item.label}<ArrowIcon />
              </motion.button>
            ))}
          </motion.nav>

          <motion.div className="footer-block footer-connect" variants={fadeUp}>
            <span>Farhan Architects</span>
            <a href="mailto:cf@ferhandesign.com.au">Email the studio <ArrowIcon /></a>
            <a href="tel:+61402427059">Call the studio <ArrowIcon /></a>
          </motion.div>
        </motion.div>

        <motion.div className="footer-meta" variants={fadeUp}>
          <span>© Farhan Architects</span>
          <span>Residential · Multi-residential · Commercial</span>
          <div>
            <span>Perth, Western Australia</span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}

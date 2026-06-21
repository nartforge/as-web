import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'
import DiscordCTA from '../components/DiscordCTA'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--nav-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 'calc(var(--nav-height) + 40px)',
        paddingBottom: 80,
        background: '#050505',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: 540, padding: '0 24px' }}
      >
        <motion.div variants={itemVariants} style={{ position: 'relative', display: 'inline-block' }}>
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 180,
              height: 180,
              border: '2px solid rgba(255, 109, 0, 0.12)',
              borderRadius: 24,
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />
          <motion.div
            animate={{
              y: [0, 12, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 120,
              height: 120,
              border: '1px solid rgba(255, 109, 0, 0.08)',
              borderRadius: 16,
              opacity: 0.3,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.06em',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFB74D 50%, #FF8A65 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 60px rgba(255, 109, 0, 0.2))',
              position: 'relative',
              zIndex: 1,
            }}
          >
            404
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ScrollReveal delay={1}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: 12,
              }}
            >
              Page not found
            </h2>
          </ScrollReveal>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ScrollReveal delay={2}>
            <p
              style={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.6,
                marginBottom: 36,
                maxWidth: 400,
                margin: '0 auto 36px',
              }}
            >
              The page you're looking for doesn't exist or has been moved.
            </p>
          </ScrollReveal>
        </motion.div>

        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}
        >
          <motion.div
            whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(255, 109, 0, 0.4)' }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/"
              className="btn btn-lg btn-primary"
              style={{ padding: '14px 28px' }}
            >
              Go Home
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -2, background: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/urunler"
              className="btn btn-lg"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                padding: '14px 28px',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Browse Products
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ScrollReveal delay={4}>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.35)',
                marginBottom: 12,
              }}
            >
              Need help? Join our Discord
            </p>
            <DiscordCTA variant="inline" />
          </ScrollReveal>
        </motion.div>
      </motion.div>
    </div>
  )
}

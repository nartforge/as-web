import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { motion } from 'framer-motion'

const footerLinks = [
  { to: '/gelistirme', labelKey: 'nav.development' },
  { to: '/magaza', labelKey: 'nav.store' },
  { to: '/urunler', labelKey: 'nav.products' },
  { to: '/wiki', labelKey: 'nav.wiki' },
  { to: '/destek', labelKey: 'nav.support' },
]

export default function Footer() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'var(--bg-alt)',
        padding: '64px 0 24px',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: 48,
          marginBottom: 40,
        }} className="footer-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: '1.25rem', marginBottom: 12 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.img
                src="/logo.png"
                alt="NartForge"
                style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }}
                whileHover={{ rotate: 5 }}
              />
              <span style={{ background: 'linear-gradient(135deg, #FF6D00, #FFB74D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                NartForge
              </span>
            </motion.div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 360, fontSize: '0.9rem' }}>
              {t('footer.description')}
            </p>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: 10 }}>Stay Updated</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                Get the latest news and updates about NartForge products.
              </p>
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    flex: 1, padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '0.82rem', outline: 'none',
                  }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '10px 16px', borderRadius: 8, border: 'none',
                    background: 'linear-gradient(135deg, #FF6D00, #FF8A65)',
                    color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Subscribe
                </motion.button>
              </form>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#22C55E', fontSize: '0.78rem', marginTop: 8 }}
                >
                  Thanks for subscribing!
                </motion.p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem', color: 'var(--text)' }}>{t('footer.pages')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {footerLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }}
                  className="footer-link"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem', color: 'var(--text)' }}>{t('footer.links')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <motion.a
                href="https://discord.gg/6N8B4aMJkw"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
                className="footer-link"
                whileHover={{ x: 3 }}
              >
                <svg width="14" height="14" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.2,60,73.2,53s5-12.74,11.44-12.74S96.14,46,96,53,91.08,65.69,84.69,65.69Z"/></svg>
                Discord
              </motion.a>
              <motion.a
                href="https://github.com/nartforge"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 6 }}
                className="footer-link"
                whileHover={{ x: 3 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span>&copy; {new Date().getFullYear()} NartForge. {t('footer.rights')}</span>
        </motion.div>
      </div>

      <style>{`
        .footer-link:hover { color: #FF6D00 !important; }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
        }
      `}</style>
    </motion.footer>
  )
}

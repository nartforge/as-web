import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = (value: string) => {
    localStorage.setItem(STORAGE_KEY, value)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            width: 'calc(100% - 32px)',
            maxWidth: 720,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: 24,
              borderRadius: 'var(--radius-lg, 16px)',
              background: 'rgba(10,12,16,0.95)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            className="cookie-consent-inner"
          >
            <p style={{ flex: 1, margin: 0, color: 'var(--text-secondary, #a0a0a0)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              We use cookies to enhance your experience. By continuing, you agree to our use of cookies.
            </p>

            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => accept('necessary')}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'transparent',
                  color: 'var(--text-muted, #888)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Accept Necessary
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => accept('all')}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'linear-gradient(135deg, #FF6D00, #FF8A65)',
                  color: '#fff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Accept All
              </motion.button>
            </div>
          </div>

          <style>{`
            @media (max-width: 640px) {
              .cookie-consent-inner {
                flex-direction: column !important;
                text-align: center !important;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

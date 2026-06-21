import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import type { Lang } from '../data/translations'
import DiscordCTA from './DiscordCTA'
import DiscordStatus from './DiscordStatus'

function useNavLinks() {
  const { t } = useLanguage()
  return [
    { to: '/', label: t('nav.home') },
    { to: '/gelistirme', label: t('nav.development') },
    { to: '/magaza', label: t('nav.store') },
    { to: '/urunler', label: t('nav.products') },
    { to: '/wiki', label: t('nav.wiki') },
    { to: '/destek', label: t('nav.support') },
  ]
}

const langOptions: { value: Lang; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
]

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { lang, setLang, t } = useLanguage()
  const navLinks = useNavLinks()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [scrolledHeavy, setScrolledHeavy] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      setScrolledHeavy(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [location])

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 'var(--nav-height)',
        background: scrolled ? (scrolledHeavy ? 'rgba(5, 5, 5, 0.92)' : 'rgba(5, 5, 5, 0.7)') : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 0 rgba(255,109,0,0.08)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
      }}
    >
      <nav className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <motion.div whileHover={{ scale: 1.02 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
            <motion.img
              src="/logo.png"
              alt="NartForge"
              style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }}
              whileHover={{ rotate: 5 }}
            />
            <motion.span
              whileHover={{ scale: 1.05 }}
              style={{ background: 'linear-gradient(135deg, #FF6D00, #FFB74D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}
            >
              NartForge
            </motion.span>
          </Link>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className={`nav-desktop ${menuOpen ? 'open' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                style={{
                  padding: '8px 14px',
                  fontSize: '0.88rem',
                  borderRadius: 8,
                  transition: 'all 0.2s',
                  background: location.pathname === link.to ? 'rgba(255, 109, 0, 0.08)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px 6px 6px', borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.04)', cursor: 'pointer',
                  }}
                  whileHover={{ borderColor: 'rgba(255,109,0,0.3)' }}
                >
                  <motion.div
                    style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF6D00, #FF8A65)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </motion.div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                        background: 'rgba(10, 12, 16, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 'var(--radius-md)', padding: '4px',
                        minWidth: 200, zIndex: 1100, boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                      }}
                    >
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '10px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                          fontSize: '0.85rem', textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                        Dashboard
                      </Link>
                      <Link to="/dashboard?tab=orders" onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '10px 12px', borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                          fontSize: '0.85rem', textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        My Orders
                      </Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false) }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '10px 12px', borderRadius: 'var(--radius-sm)', color: '#EF4444',
                          fontSize: '0.85rem', border: 'none', background: 'transparent', cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className={`nav-link ${location.pathname === '/login' || location.pathname === '/register' ? 'active' : ''}`}
                style={{
                  padding: '8px 14px', fontSize: '0.88rem',
                  borderRadius: 8,
                  background: (location.pathname === '/login' || location.pathname === '/register') ? 'rgba(255, 109, 0, 0.08)' : 'transparent',
                }}
              >
                {t('nav.signIn')}
              </Link>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DiscordStatus />
          </div>

          <div ref={langRef} style={{ position: 'relative' }}>
            <motion.button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)', fontSize: '0.82rem', fontWeight: 600,
                transition: 'all 0.2s', cursor: 'pointer', color: 'var(--text)',
              }}
              whileHover={{ borderColor: 'rgba(255,109,0,0.3)' }}
              aria-label="Language"
            >
              {langOptions.find(o => o.value === lang)?.flag}
              <span>{lang.toUpperCase()}</span>
              <motion.svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5 }}
                animate={{ rotate: langOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </motion.svg>
            </motion.button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    background: 'rgba(10, 12, 16, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)', padding: '4px',
                    minWidth: 150, zIndex: 1100, boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                  }}
                >
                  {langOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setLang(opt.value); setLangOpen(false) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                        padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                        border: 'none', background: lang === opt.value ? 'rgba(255,109,0,0.15)' : 'transparent',
                        color: lang === opt.value ? '#FFB74D' : 'var(--text)', fontSize: '0.85rem',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { if (lang !== opt.value) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                      onMouseLeave={e => { if (lang !== opt.value) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span>{opt.flag}</span>
                      <span>{opt.label}</span>
                      {lang === opt.value && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFB74D" strokeWidth="2.5" style={{ marginLeft: 'auto' }}><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={toggleTheme}
            animate={{ rotate: theme === 'dark' ? 0 : 180 }}
            style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: '1rem',
              transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
            }}
            whileHover={{ borderColor: 'rgba(255,109,0,0.3)', boxShadow: '0 0 20px rgba(255,109,0,0.15)' }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.svg
                  key="moon"
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </motion.svg>
              ) : (
                <motion.svg
                  key="sun"
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.a
            href="https://github.com/nartforge"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)', color: 'var(--text)', transition: 'all 0.2s',
            }}
            whileHover={{ borderColor: 'rgba(255,109,0,0.3)' }}
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </motion.a>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DiscordCTA title="" variant="inline" style={{ padding: '6px 10px', fontSize: '0.78rem', gap: 4 }} />
          </div>

          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              width: 36, height: 36, display: 'none', alignItems: 'center', justifyContent: 'center',
              borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: '1.2rem',
            }}
            whileTap={{ scale: 0.9 }}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-desktop-mobile"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              top: 'var(--nav-height)',
              left: 0,
              right: 0,
              background: 'rgba(5, 5, 5, 0.95)',
              backdropFilter: 'blur(24px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: 16,
              maxHeight: '80vh',
              overflowY: 'auto',
              zIndex: 999,
            }}
          >
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                style={{
                  padding: '14px 16px',
                  fontSize: '0.95rem',
                  display: 'block',
                  borderRadius: 8,
                  marginBottom: 2,
                  background: location.pathname === link.to ? 'rgba(255, 109, 0, 0.08)' : 'transparent',
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link
                to="/dashboard"
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                style={{
                  padding: '14px 16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8,
                  borderRadius: 8, marginBottom: 2,
                  background: location.pathname === '/dashboard' ? 'rgba(255, 109, 0, 0.08)' : 'transparent',
                }}
                onClick={() => setMenuOpen(false)}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6D00, #FF8A65)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700,
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {t('nav.dashboard')}
              </Link>
            ) : (
              <Link
                to="/login"
                style={{
                  padding: '14px 16px', fontSize: '0.95rem', display: 'block',
                  borderRadius: 8, color: 'var(--text)',
                  background: (location.pathname === '/login' || location.pathname === '/register') ? 'rgba(255, 109, 0, 0.08)' : 'transparent',
                }}
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.signIn')}
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .nav-desktop { display: none !important; }
        }
      `}</style>
    </motion.header>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DiscordCTA from '../components/DiscordCTA'
import ScrollReveal from '../components/ScrollReveal'
import AnimatedCounter from '../components/AnimatedCounter'
import WaveDivider from '../components/WaveDivider'
import CanvasParticles from '../components/CanvasParticles'
import ParallaxSection from '../components/ParallaxSection'
import Skeleton from '../components/Skeleton'
import TiltCard from '../components/TiltCard'
import { products } from '../data/products'
import { useLanguage } from '../context/LanguageContext'

const features = (t: (key: string) => string) => [
  {
    title: t('home.featureBotTitle'),
    desc: t('home.featureBotDesc'),
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    title: t('home.featureMinecraftTitle'),
    desc: t('home.featureMinecraftDesc'),
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    title: t('home.featureWebTitle'),
    desc: t('home.featureWebDesc'),
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    title: t('home.featureCustomTitle'),
    desc: t('home.featureCustomDesc'),
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
]

const whyUs = (t: (key: string) => string) => [
  {
    title: t('home.whyUsQualityTitle'),
    desc: t('home.whyUsQualityDesc'),
  },
  {
    title: t('home.whyUsUpdatesTitle'),
    desc: t('home.whyUsUpdatesDesc'),
  },
  {
    title: t('home.whyUsSupportTitle'),
    desc: t('home.whyUsSupportDesc'),
  },
  {
    title: t('home.whyUsCustomTitle'),
    desc: t('home.whyUsCustomDesc'),
  },
]

const testimonials = (t: (key: string) => string) => [
  {
    quote: t('home.testimonial1Quote'),
    name: t('home.testimonial1Name'),
    role: t('home.testimonial1Role'),
    initial: 'A',
  },
  {
    quote: t('home.testimonial2Quote'),
    name: t('home.testimonial2Name'),
    role: t('home.testimonial2Role'),
    initial: 'S',
  },
  {
    quote: t('home.testimonial3Quote'),
    name: t('home.testimonial3Name'),
    role: t('home.testimonial3Role'),
    initial: 'J',
  },
]

const faqItems = (t: (key: string) => string) => [
  {
    q: t('home.faq1Q'),
    a: t('home.faq1A'),
  },
  {
    q: t('home.faq2Q'),
    a: t('home.faq2A'),
  },
  {
    q: t('home.faq3Q'),
    a: t('home.faq3A'),
  },
  {
    q: t('home.faq4Q'),
    a: t('home.faq4A'),
  },
  {
    q: t('home.faq5Q'),
    a: t('home.faq5A'),
  },
]

const comparisonData = (t: (key: string) => string) => [
  { feature: t('home.comparisonRow1'), us: true, others: false },
  { feature: t('home.comparisonRow2'), us: true, others: false },
  { feature: t('home.comparisonRow3'), us: true, others: true },
  { feature: t('home.comparisonRow4'), us: true, others: false },
  { feature: t('home.comparisonRow5'), us: true, others: false },
  { feature: t('home.comparisonRow6'), us: true, others: false },
  { feature: t('home.comparisonRow7'), us: true, others: true },
]

const pricingData = (t: (key: string) => string) => [
  {
    name: t('home.pricingPlanPluginName'),
    price: '€14.99',
    desc: t('home.pricingPlanPluginDesc'),
    features: [t('home.pricingPlanPluginFeat1'), t('home.pricingPlanPluginFeat2'), t('home.pricingPlanPluginFeat3'), t('home.pricingPlanPluginFeat4')],
    featured: false,
    cta: t('home.pricingPlanPluginCta'),
    link: '/magaza',
  },
  {
    name: t('home.pricingPlanBotName'),
    price: 'Custom',
    desc: t('home.pricingPlanBotDesc'),
    features: [t('home.pricingPlanBotFeat1'), t('home.pricingPlanBotFeat2'), t('home.pricingPlanBotFeat3'), t('home.pricingPlanBotFeat4')],
    featured: true,
    cta: t('home.pricingPlanBotCta'),
    link: '/destek',
  },
  {
    name: t('home.pricingPlanPackName'),
    price: '€39.99',
    desc: t('home.pricingPlanPackDesc'),
    features: [t('home.pricingPlanPackFeat1'), t('home.pricingPlanPackFeat2'), t('home.pricingPlanPackFeat3'), t('home.pricingPlanPackFeat4')],
    featured: false,
    cta: t('home.pricingPlanPackCta'),
    link: '/magaza',
  },
]

function GlowOrb({ className, style, size = 400, color = 'rgba(255,109,0,0.08)' }: { className?: string; style?: React.CSSProperties; size?: number; color?: string }) {
  return (
    <motion.div
      className={className}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -30, 20, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [faqSearch, setFaqSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()
  const filteredFaq = faqSearch
    ? faqItems(t).filter(item => item.q.toLowerCase().includes(faqSearch.toLowerCase()) || item.a.toLowerCase().includes(faqSearch.toLowerCase()))
    : faqItems(t)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="page-enter">
      {/* ===== HERO ===== */}
      <section className="snap-section" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#050505',
      }}>
        <GlowOrb size={700} color="rgba(255,109,0,0.08)" />
        <GlowOrb
          size={500}
          color="rgba(255,138,101,0.06)"
          className=""
          style={{ position: 'absolute', top: '60%', left: '70%', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }}
        />
        <GlowOrb
          size={300}
          color="rgba(255,183,77,0.04)"
          className=""
          style={{ position: 'absolute', top: '20%', left: '30%', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }}
        />
        <motion.div
          style={{
            position: 'absolute', width: 200, height: 200, borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.04)',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(20px)',
            top: '15%', right: '10%', zIndex: 1, pointerEvents: 'none',
            transform: 'rotate(12deg)',
          }}
          animate={{ y: [0, -20, 0], rotate: [12, 14, 12] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{
            position: 'absolute', width: 140, height: 140, borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.03)',
            background: 'rgba(255,109,0,0.03)',
            backdropFilter: 'blur(16px)',
            bottom: '20%', left: '8%', zIndex: 1, pointerEvents: 'none',
            transform: 'rotate(-8deg)',
          }}
          animate={{ y: [0, 15, 0], rotate: [-8, -6, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="mesh-bg" />
        <CanvasParticles />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          overflow: 'hidden', pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {Array.from({ length: 6 }).map((_, row) => (
            <motion.div
              key={row}
              style={{
                position: 'absolute',
                fontSize: 'clamp(5rem, 14vw, 11rem)',
                fontWeight: 900,
                color: 'rgba(255,255,255,0.015)',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.04em',
                userSelect: 'none',
                fontFamily: 'var(--font-sans)',
                top: `${5 + row * 18}%`,
                transform: row % 2 === 0 ? 'translateX(-10%)' : 'translateX(10%)',
              }}
              animate={{
                x: [0, row % 2 === 0 ? 80 : -80, 0],
              }}
              transition={{
                duration: 25 + row * 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              NartForge
            </motion.div>
          ))}
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 'var(--nav-height)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <ScrollReveal>
              <motion.div
                style={{ marginBottom: 24 }}
                whileHover={{ scale: 1.02 }}
              >
                <span className="section-label" style={{ background: 'rgba(255,109,0,0.12)', color: '#FFB74D', borderColor: 'rgba(255,109,0,0.2)' }}>
                  <motion.span
                    style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFB74D', display: 'inline-block' }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {t('home.heroLabel')}
                </span>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <motion.div style={{ marginBottom: 8 }}>
                <h1
                  style={{
                    fontSize: 'clamp(3.2rem, 7vw, 5.5rem)',
                    fontWeight: 200,
                    lineHeight: 1.05,
                    letterSpacing: '-0.06em',
                    fontFamily: 'var(--font-sans)',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #FFD54F 30%, #FFB74D 60%, #FF8A65 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 50px rgba(255,109,0,0.2))',
                    marginBottom: 12,
                  }}
                >
                  {t('home.heroTitle')}
                </h1>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <motion.div
                style={{
                  width: 60, height: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, transparent, #FF6D00, #FFB74D, #FF6D00, transparent)',
                  margin: '0 auto 20px',
                  opacity: 0.6,
                }}
              />
              <motion.p style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                color: 'rgba(255,255,255,0.5)',
                maxWidth: 520,
                lineHeight: 1.6,
                marginBottom: 36,
                fontFamily: 'var(--font-sans)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
              }}>
                {t('home.heroSlogan')}
              </motion.p>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <motion.div
                style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}
                whileHover={{ scale: 1.01 }}
              >
                <motion.a
                  href="https://discord.gg/6N8B4aMJkw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg"
                  style={{
                    background: '#5865F2', color: '#fff', padding: '14px 28px',
                    boxShadow: '0 4px 20px rgba(88,101,242,0.4)',
                  }}
                  whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(88,101,242,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.2,60,73.2,53s5-12.74,11.44-12.74S96.14,46,96,53,91.08,65.69,84.69,65.69Z"/>
                  </svg>
                  {t('home.ctaButton')}
                </motion.a>
                <motion.a
                  href="mailto:nartforge@gmail.com"
                  className="btn btn-lg"
                  style={{
                    background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '14px 28px',
                    backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  whileHover={{ y: -2, background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  {t('auth.email')}
                </motion.a>
                <motion.a
                  href="https://github.com/nartforge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg"
                  style={{
                    background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '14px 28px',
                    backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  whileHover={{ y: -2, background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </motion.a>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={4}>
              <motion.div style={{ marginTop: 48 }}>
                <Link to="/urunler">
                  <motion.span
                    className="btn btn-lg"
                    style={{
                      background: 'linear-gradient(135deg, #FF6D00, #FF8A65)',
                      color: '#fff', padding: '14px 32px',
                      boxShadow: '0 4px 25px rgba(255,109,0,0.35)',
                    }}
                    whileHover={{ y: -2, boxShadow: '0 8px 35px rgba(255,109,0,0.5)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {t('home.browseProducts')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </motion.span>
                </Link>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={5}>
              <motion.div style={{
                marginTop: 48,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24,
                flexWrap: 'wrap',
              }}>
                {[
                  { icon: '🛡️', text: '100% Uptime' },
                  { icon: '⚡', text: 'Fast Support' },
                  { icon: '🔒', text: 'Secure Checkout' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.02em',
                    }}
                    whileHover={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="scroll-mouse" />
          <span>{t('home.scroll')}</span>
        </motion.div>
      </section>

      <WaveDivider flip />

      {/* ===== DARK STATS ===== */}
      <section className="section-dark snap-section" style={{ padding: '100px 0' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal className="text-center" style={{ marginBottom: 48 }}>
            <motion.span className="section-label" style={{ background: 'rgba(255,109,0,0.12)', color: '#FFB74D', borderColor: 'rgba(255,109,0,0.2)' }}>
              {t('home.statsLabel')}
            </motion.span>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>{t('home.statsTitle')}</h2>
          </ScrollReveal>
          <div className="stats-dark">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="stat-item">
                <AnimatedCounter target={15} suffix="+" />
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{t('home.statsProducts')}</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="stat-item">
                <AnimatedCounter target={500} suffix="+" />
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{t('home.statsHappyClients')}</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="stat-item">
                <div className="counter-number">24/7</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{t('home.statsSupport')}</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="stat-item">
                <AnimatedCounter target={100} suffix="%" />
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{t('home.statsSatisfaction')}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* ===== WHAT IS NARTFORGE ===== */}
      <section className="section snap-section" style={{ paddingTop: 120, paddingBottom: 120 }}>
        <div className="container">
          <ParallaxSection speed={0.3}>
          <div className="grid-2" style={{ alignItems: 'center', gap: 60 }}>
            <ScrollReveal>
              <motion.span className="section-label">{t('home.aboutLabel')}</motion.span>
              <h2 className="section-title">{t('home.aboutTitle')}</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 20, fontSize: '1.05rem' }}>
                {t('home.aboutDesc1')}
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                {t('home.aboutDesc2')}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <motion.div className="glass-card" style={{ backdropFilter: 'blur(20px)' }} whileHover={{ y: -4 }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    t('home.aboutListItem1'),
                    t('home.aboutListItem2'),
                    t('home.aboutListItem3'),
                    t('home.aboutListItem4'),
                  ].map((text, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <motion.span style={{
                        minWidth: 24, height: 24, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF6D00, #FF8A65)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 700, flexShrink: 0, marginTop: 2,
                      }}
                        whileHover={{ scale: 1.15 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </motion.span>
                      <span style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </ScrollReveal>
          </div>
          </ParallaxSection>
        </div>
      </section>

      {/* ===== FEATURES (BENTO GRID) ===== */}
      <section className="section-dark snap-section" style={{ padding: '120px 0' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal className="text-center" style={{ marginBottom: 60 }}>
            <motion.span className="section-label" style={{ background: 'rgba(255,109,0,0.12)', color: '#FFB74D', borderColor: 'rgba(255,109,0,0.2)' }}>
              {t('home.servicesLabel')}
            </motion.span>
            <h2 className="section-title">{t('home.servicesTitle')}</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {t('home.servicesSubtitle')}
            </p>
          </ScrollReveal>

          {/* Bento grid: 2 large + 2 smaller */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(255,109,0,0.12)' }}
              style={{ gridColumn: 'span 1', gridRow: 'span 2', background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)', padding: 48, backdropFilter: 'blur(12px)' }}
            >
              <div className="feature-icon-wrap" style={{ margin: '0 0 20px' }}>
                {features(t)[0].icon}
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: '1.3rem', color: '#fff' }}>{features(t)[0].title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontSize: '0.95rem', maxWidth: 320 }}>{features(t)[0].desc}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(255,109,0,0.12)' }}
              style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)', padding: 36, backdropFilter: 'blur(12px)' }}
            >
              <div className="feature-icon-wrap" style={{ margin: '0 0 16px', width: 48, height: 48 }}>
                {features(t)[1].icon}
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: 6, fontSize: '1.1rem', color: '#fff' }}>{features(t)[1].title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: '0.88rem' }}>{features(t)[1].desc}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(255,109,0,0.12)' }}
              style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)', padding: 36, backdropFilter: 'blur(12px)' }}
            >
              <div className="feature-icon-wrap" style={{ margin: '0 0 16px', width: 48, height: 48 }}>
                {features(t)[2].icon}
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: 6, fontSize: '1.1rem', color: '#fff' }}>{features(t)[2].title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: '0.88rem' }}>{features(t)[2].desc}</p>
            </motion.div>
          </div>

          {/* Bento row 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(255,109,0,0.12)' }}
            style={{ marginTop: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)', padding: 36, backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 24 }}
          >
            <div className="feature-icon-wrap" style={{ margin: 0, width: 48, height: 48, flexShrink: 0 }}>
              {features(t)[3].icon}
            </div>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 4, fontSize: '1.1rem', color: '#fff' }}>{features(t)[3].title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: '0.88rem', margin: 0 }}>{features(t)[3].desc}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <WaveDivider flip />

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section snap-section" style={{ paddingTop: 120, paddingBottom: 120 }}>
        <div className="container">
          <ScrollReveal className="text-center" style={{ marginBottom: 60 }}>
            <motion.span className="section-label">{t('home.featuredLabel')}</motion.span>
            <h2 className="section-title">{t('home.featuredTitle')}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              {t('home.featuredSubtitle')}
            </p>
          </ScrollReveal>
          <div className="grid-3">
            {loading ? (
              <>
                <Skeleton variant="card" />
                <Skeleton variant="card" />
                <Skeleton variant="card" />
              </>
            ) : products.slice(0, 3).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
              >
                <TiltCard maxTilt={8} glare>
                  <Link to="/magaza" style={{ display: 'block' }}>
                    <div className="card card-gradient" style={{ height: '100%' }}>
                      <div style={{ marginBottom: 16 }}>
                        <span className={`tag ${product.status === 'active' ? 'tag-success' : product.status === 'beta' ? 'tag-warning' : 'tag-muted'}`}>
                          {product.status === 'active' ? t('product.active') : product.status === 'beta' ? t('product.beta') : t('product.comingSoon')}
                        </span>
                      </div>
                      <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1.15rem' }}>{product.name}</h3>
                      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: 16 }}>{product.description}</p>
                      <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.1rem' }}>{product.price}</span>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>
          <ScrollReveal className="text-center" style={{ marginTop: 40 }}>
            <Link to="/magaza">
              <motion.span
                className="btn btn-primary"
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(255,109,0,0.4)' }}
                whileTap={{ scale: 0.97 }}
              >
                {t('home.viewAllProducts')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </motion.span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="section-dark snap-section" style={{ padding: '120px 0' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal className="text-center" style={{ marginBottom: 60 }}>
            <motion.span className="section-label" style={{ background: 'rgba(255,109,0,0.12)', color: '#FFB74D', borderColor: 'rgba(255,109,0,0.2)' }}>
              {t('home.pricingLabel')}
            </motion.span>
            <h2 className="section-title">{t('home.pricingTitle')}</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {t('home.pricingSubtitle')}
            </p>
          </ScrollReveal>
          <motion.div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
            <span style={{ color: billing === 'monthly' ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 500 }}>Monthly</span>
            <motion.button
              onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
              style={{
                width: 48, height: 26, borderRadius: 13, padding: 3,
                background: billing === 'yearly' ? 'linear-gradient(135deg, #FF6D00, #FF8A65)' : 'rgba(255,255,255,0.1)',
                cursor: 'pointer', border: 'none', position: 'relative',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ x: billing === 'yearly' ? 22 : 0 }}
                style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#fff',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span style={{ color: billing === 'yearly' ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 500 }}>
              Yearly
              <span style={{ color: '#22C55E', fontSize: '0.75rem', marginLeft: 4 }}>Save 20%</span>
            </span>
          </motion.div>
          <div className="grid-3" style={{ alignItems: 'stretch' }}>
            {pricingData(t).map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
                whileHover={{ y: -6 }}
              >
                <div className={`pricing-card ${plan.featured ? 'featured' : ''}`} style={{
                  display: 'flex', flexDirection: 'column', height: '100%',
                  background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)',
                }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: '#fff' }}>{plan.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: 4 }}>{plan.desc}</p>
                  <div className="pricing-price">{plan.price}</div>
                  <ul className="pricing-features" style={{ flex: 1 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ color: 'rgba(255,255,255,0.6)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={plan.link} className={`btn ${plan.featured ? 'btn-primary' : ''}`} style={{
                    width: '100%', background: plan.featured ? 'linear-gradient(135deg, #FF6D00, #FF8A65)' : 'rgba(255,255,255,0.06)',
                    color: '#fff', border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}>
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* ===== WHY US ===== */}
      <section className="section snap-section" style={{ paddingTop: 120, paddingBottom: 120 }}>
        <div className="container">
          <ScrollReveal className="text-center" style={{ marginBottom: 60 }}>
            <motion.span className="section-label">{t('home.whyUsLabel')}</motion.span>
            <h2 className="section-title">{t('home.whyUsTitle')}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              {t('home.whyUsSubtitle')}
            </p>
          </ScrollReveal>
          <ParallaxSection speed={0.2}>
          <div className="grid-4">
            {whyUs(t).map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
                whileHover={{ y: -4 }}
              >
                <div className="card" style={{ padding: '32px 24px' }}>
                  <motion.div style={{
                    width: 40, height: 4, borderRadius: 2,
                    background: 'linear-gradient(135deg, #FF6D00, #FF8A65)', marginBottom: 20,
                  }}
                    animate={{ width: [40, 60, 40] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1.05rem' }}>{w.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>{w.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          </ParallaxSection>
        </div>
      </section>

      {/* ===== COMPARISON ===== */}
      <section className="section-dark snap-section" style={{ padding: '120px 0' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal className="text-center" style={{ marginBottom: 60 }}>
            <motion.span className="section-label" style={{ background: 'rgba(255,109,0,0.12)', color: '#FFB74D', borderColor: 'rgba(255,109,0,0.2)' }}>
              {t('home.comparisonLabel')}
            </motion.span>
            <h2 className="section-title">{t('home.comparisonTitle')}</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {t('home.comparisonSubtitle')}
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <motion.div style={{ overflowX: 'auto' }} whileHover={{ scale: 1.005 }}>
              <table className="comparison-table" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <thead>
                  <tr>
                    <th style={{ background: 'rgba(255,255,255,0.04)', color: '#fff' }}>{t('home.comparisonHeaderFeature')}</th>
                    <th style={{ color: '#FFB74D', textAlign: 'center', background: 'rgba(255,255,255,0.04)' }}>{t('home.comparisonHeaderUs')}</th>
                    <th style={{ textAlign: 'center', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)' }}>{t('home.comparisonHeaderOthers')}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData(t).map((row, i) => (
                    <motion.tr
                      key={row.feature}
                      style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.05 * i }}
                    >
                      <td style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.05)' }}>{row.feature}</td>
                      <td style={{ textAlign: 'center', borderColor: 'rgba(255,255,255,0.05)' }}>
                        {row.us ? (
                          <svg className="check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <svg className="cross" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', borderColor: 'rgba(255,255,255,0.05)' }}>
                        {row.others ? (
                          <svg className="check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <svg className="cross" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider />

      {/* ===== TESTIMONIALS ===== */}
      <section className="section snap-section" style={{ paddingTop: 120, paddingBottom: 120 }}>
        <div className="container">
          <ScrollReveal className="text-center" style={{ marginBottom: 60 }}>
            <motion.span className="section-label">{t('home.testimonialsLabel')}</motion.span>
            <h2 className="section-title">{t('home.testimonialsTitle')}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              {t('home.testimonialsSubtitle')}
            </p>
          </ScrollReveal>
          <div className="grid-3">
            {testimonials(t).map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
                whileHover={{ y: -6 }}
              >
                <div className="testimonial-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: 20, flex: 1, position: 'relative', zIndex: 1 }}>
                    "{testimonial.quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <motion.div className="testimonial-avatar" style={{
                      background: 'linear-gradient(135deg, #FF6D00, #FF8A65)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: '1.1rem',
                    }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {testimonial.initial}
                    </motion.div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{testimonial.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section-dark snap-section" style={{ padding: '120px 0' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal className="text-center" style={{ marginBottom: 60 }}>
            <motion.span className="section-label" style={{ background: 'rgba(255,109,0,0.12)', color: '#FFB74D', borderColor: 'rgba(255,109,0,0.2)' }}>
              {t('home.faqLabel')}
            </motion.span>
            <h2 className="section-title">{t('home.faqTitle')}</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {t('home.faqSubtitle')}
            </p>
          </ScrollReveal>
          <motion.div style={{ maxWidth: 700, margin: '0 auto 24px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.04)', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                value={faqSearch}
                onChange={e => setFaqSearch(e.target.value)}
                placeholder="Search FAQ..."
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: '#fff', fontSize: '0.9rem',
                }}
              />
              {faqSearch && (
                <button onClick={() => setFaqSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          </motion.div>
          <ScrollReveal>
            <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredFaq.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: 32 }}>No matching questions found</p>
              ) : filteredFaq.map((item, i) => (
                <motion.div
                  key={i}
                  className="faq-item"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="faq-question"
                    style={{ background: 'rgba(255,255,255,0.03)', color: '#fff' }}
                  >
                    {item.q}
                    <motion.svg
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ flexShrink: 0 }}
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </motion.svg>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        className="faq-answer"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        {item.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider flip />

      {/* ===== FINAL CTA ===== */}
      <section className="snap-section" style={{
        padding: '120px 0', textAlign: 'center', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #050505 50%, #0A0A0A 100%)',
      }}>
        <div className="mesh-bg" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <motion.div
              style={{
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-xl)',
                padding: '80px 40px',
                position: 'relative',
                overflow: 'hidden',
              }}
              whileHover={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            >
              <div className="hero-glow" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,109,0,0.06) 0%, transparent 70%)' }} />
              <div style={{ position: 'relative' }}>
                <h2 className="section-title" style={{ fontSize: '2.5rem', color: '#fff', background: 'none', WebkitTextFillColor: '#fff' }}>
                  {t('home.ctaTitle')}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 32, fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 32px' }}>
                  {t('home.ctaDesc')}
                </p>
                <DiscordCTA variant="hero" title={t('home.ctaButton')} />
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

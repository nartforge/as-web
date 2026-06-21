import ScrollReveal from '../components/ScrollReveal'
import DiscordCTA from '../components/DiscordCTA'
import { useLanguage } from '../context/LanguageContext'

const services = (t: (key: string) => string) => [
  {
    title: t('dev.service1Title'),
    desc: t('dev.service1Desc'),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: t('dev.service2Title'),
    desc: t('dev.service2Desc'),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: t('dev.service3Title'),
    desc: t('dev.service3Desc'),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: t('dev.service4Title'),
    desc: t('dev.service4Desc'),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    title: t('dev.service5Title'),
    desc: t('dev.service5Desc'),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: t('dev.service6Title'),
    desc: t('dev.service6Desc'),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

const technologies = [
  'Java', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Tailwind CSS', 'MySQL', 'MongoDB',
]

const process = (t: (key: string) => string) => [
  { step: 1, title: t('dev.process1Title'), desc: t('dev.process1Desc') },
  { step: 2, title: t('dev.process2Title'), desc: t('dev.process2Desc') },
  { step: 3, title: t('dev.process3Title'), desc: t('dev.process3Desc') },
  { step: 4, title: t('dev.process4Title'), desc: t('dev.process4Desc') },
  { step: 5, title: t('dev.process5Title'), desc: t('dev.process5Desc') },
  { step: 6, title: t('dev.process6Title'), desc: t('dev.process6Desc') },
]

const projectTypes = (t: (key: string) => string) => [
  { title: t('dev.project1Title'), desc: t('dev.project1Desc'), icon: '🖥️' },
  { title: t('dev.project2Title'), desc: t('dev.project2Desc'), icon: '🌐' },
  { title: t('dev.project3Title'), desc: t('dev.project3Desc'), icon: '👥' },
  { title: t('dev.project4Title'), desc: t('dev.project4Desc'), icon: '⚙️' },
  { title: t('dev.project5Title'), desc: t('dev.project5Desc'), icon: '🎮' },
  { title: t('dev.project6Title'), desc: t('dev.project6Desc'), icon: '📊' },
]

export default function Gelistirme() {
  const { t } = useLanguage()
  return (
    <div className="page-enter" style={{ paddingTop: 'var(--nav-height)' }}>

      {/* ===== HERO ===== */}
      <section className="dev-hero">
        <div className="dev-hero-bg" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="dev-hero-grid">
            <div>
              <ScrollReveal>
                <div className="badge badge-orange" style={{ marginBottom: 16, display: 'inline-flex' }}>{t('dev.mostRequested')}</div>
              </ScrollReveal>
              <ScrollReveal delay={1}>
                <div className="dev-hero-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <h1 className="dev-hero-title">{t('dev.title')}</h1>
              </ScrollReveal>
              <ScrollReveal delay={2}>
                <p className="dev-hero-desc">
                  {t('dev.heroDesc')}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={3}>
                <div className="dev-tags">
                  {[t('dev.tag1'), t('dev.tag2'), t('dev.tag3'), t('dev.tag4'), t('dev.tag5'), t('dev.tag6')].map(tag => (
                    <span key={tag} className="dev-tag">{tag}</span>
                  ))}
                </div>
              </ScrollReveal>
              <ScrollReveal delay={4}>
                <div className="dev-hero-actions">
                  <a href="#services" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                    {t('dev.explore')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </a>
                  <DiscordCTA title={t('support.contactUs')} variant="inline" style={{ padding: '14px 24px', fontSize: '1rem' }} />
                </div>
              </ScrollReveal>
            </div>
            <div>
              <ScrollReveal delay={2}>
                <div className="dev-stats-card">
                  <div className="dev-stats-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    {t('dev.atGlance')}
                  </div>
                  <div className="dev-stats-grid">
                    <div className="dev-stat-item">
                      <div className="dev-stat-value">50+</div>
                      <div className="dev-stat-label">{t('dev.statProjects')}</div>
                    </div>
                    <div className="dev-stat-item">
                      <div className="dev-stat-value">Fast</div>
                      <div className="dev-stat-label">{t('dev.statDelivery')}</div>
                    </div>
                    <div className="dev-stat-item">
                      <div className="dev-stat-value">24/7</div>
                      <div className="dev-stat-label">{t('dev.statSupport')}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPULAR SERVICES ===== */}
      <section id="services" className="section" style={{ paddingTop: 100, paddingBottom: 100 }}>
        <div className="container">
          <ScrollReveal className="text-center" style={{ marginBottom: 60 }}>
            <span className="section-label">{t('dev.servicesLabel')}</span>
            <h2 className="section-title">{t('dev.servicesTitle')}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              {t('dev.servicesSubtitle')}
            </p>
          </ScrollReveal>
          <div className="dev-services-grid">
            {services(t).map((s, i) => (
              <ScrollReveal key={s.title} delay={(i % 3 + 1) as 1|2|3}>
                <div className="dev-service-card">
                  <div className="dev-service-icon">{s.icon}</div>
                  <h3 className="dev-service-title">{s.title}</h3>
                  <p className="dev-service-desc">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TECHNOLOGIES ===== */}
      <section className="section-dark" style={{ padding: '100px 0' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal className="text-center" style={{ marginBottom: 48 }}>
            <span className="section-label" style={{ background: 'rgba(230,81,0,0.15)', color: '#FF8A65', borderColor: 'rgba(230,81,0,0.2)' }}>
              {t('dev.techLabel')}
            </span>
            <h2 className="section-title">{t('dev.techTitle')}</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {t('dev.techSubtitle')}
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="dev-tech-grid">
              {technologies.map(tech => (
                <div key={tech} className="dev-tech-item">{tech}</div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="section" style={{ paddingTop: 100, paddingBottom: 100 }}>
        <div className="container">
          <ScrollReveal className="text-center" style={{ marginBottom: 60 }}>
            <span className="section-label">{t('dev.processLabel')}</span>
            <h2 className="section-title">{t('dev.processTitle')}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              {t('dev.processSubtitle')}
            </p>
          </ScrollReveal>
          <div className="dev-process-grid">
            {process(t).map((p, i) => (
              <ScrollReveal key={p.step} delay={(i % 3 + 1) as 1|2|3}>
                <div className="dev-process-card">
                  <div className="dev-process-number">{String(p.step).padStart(2, '0')}</div>
                  <h3 className="dev-process-title">{p.title}</h3>
                  <p className="dev-process-desc">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECT TYPES ===== */}
      <section className="section-dark" style={{ padding: '100px 0' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal className="text-center" style={{ marginBottom: 60 }}>
            <span className="section-label" style={{ background: 'rgba(230,81,0,0.15)', color: '#FF8A65', borderColor: 'rgba(230,81,0,0.2)' }}>
              {t('dev.projectLabel')}
            </span>
            <h2 className="section-title">{t('dev.projectTitle')}</h2>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {t('dev.projectSubtitle')}
            </p>
          </ScrollReveal>
          <div className="dev-projects-grid">
            {projectTypes(t).map((pt, i) => (
              <ScrollReveal key={pt.title} delay={(i % 3 + 1) as 1|2|3}>
                <div className="dev-project-card">
                  <div className="dev-project-emoji">{pt.icon}</div>
                  <h3 className="dev-project-title">{pt.title}</h3>
                  <p className="dev-project-desc">{pt.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="section" style={{ paddingTop: 100, paddingBottom: 100 }}>
        <div className="container">
          <ScrollReveal className="text-center">
            <div className="dev-cta-card">
              <div className="dev-cta-glow" />
              <div style={{ position: 'relative' }}>
                <span className="section-label">{t('dev.ctaLabel')}</span>
                <h2 className="section-title" style={{ fontSize: '2.2rem' }}>{t('dev.ctaTitle')}</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7, fontSize: '1.05rem' }}>
                  {t('dev.ctaDesc')}
                </p>
                <div className="dev-hero-actions" style={{ justifyContent: 'center' }}>
                  <a href="mailto:nartforge@gmail.com" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                    {t('dev.ctaButton')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </a>
                  <DiscordCTA title={t('dev.ctaDiscord')} variant="inline" style={{ padding: '14px 24px', fontSize: '1rem' }} />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}

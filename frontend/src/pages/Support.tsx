import { useState } from 'react'
import ScrollReveal from '../components/ScrollReveal'
import DiscordCTA from '../components/DiscordCTA'
import { useLanguage } from '../context/LanguageContext'

const supportCards = (t: (key: string) => string) => [
  {
    title: t('support.general'),
    desc: t('support.generalDesc'),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    title: t('support.setup'),
    desc: t('support.setupDesc'),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    title: t('support.customOrder'),
    desc: t('support.customOrderDesc'),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    title: t('support.bugReport'),
    desc: t('support.bugReportDesc'),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
]

export default function Support() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) return
    setSubmitted(true)
  }

  return (
    <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <ScrollReveal className="text-center" style={{ marginBottom: 60 }}>
            <h1 className="section-title">{t('support.title')}</h1>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              {t('support.subtitle')}
            </p>
          </ScrollReveal>

          {/* Support Cards */}
          <div className="grid-4" style={{ marginBottom: 80 }}>
            {supportCards(t).map((card, i) => (
              <ScrollReveal key={card.title} delay={(i + 1) as 1|2|3|4}>
                <div className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-md)',
                    background: 'var(--gradient-primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>{card.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: 16 }}>
                    {card.desc}
                  </p>
                  <DiscordCTA variant="inline" title={t('support.contactUs')} />
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Discord CTA */}
          <ScrollReveal style={{ marginBottom: 80 }}>
            <div className="card" style={{
              textAlign: 'center', padding: '48px 32px',
              background: 'linear-gradient(135deg, rgba(88,101,242,0.05), rgba(88,101,242,0.02))',
              border: '1px solid rgba(88,101,242,0.2)',
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>
                {t('support.discordTitle')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28, maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.7 }}>
                {t('support.discordDesc')}
              </p>
              <DiscordCTA variant="hero" title={t('support.goToDiscord')} />
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal>
            <div className="card" style={{ maxWidth: 600, margin: '0 auto', padding: '40px 32px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>{t('support.contactForm')}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '0.9rem' }}>
                {t('support.formDesc')}
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'var(--gradient-primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', fontSize: '1.5rem',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{t('support.thankYou')}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.7 }}>
                    {t('support.thankYouDesc')}
                  </p>
                  <DiscordCTA title={t('support.goToDiscord')} />
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                        {t('support.name')}
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder={t('support.namePlaceholder')}
                        style={{
                          width: '100%', padding: '12px 16px',
                          background: 'var(--bg-alt)', border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                          fontSize: '0.95rem', outline: 'none',
                          transition: 'border-color var(--transition)',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                        {t('support.email')}
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder={t('support.emailPlaceholder')}
                        style={{
                          width: '100%', padding: '12px 16px',
                          background: 'var(--bg-alt)', border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                          fontSize: '0.95rem', outline: 'none',
                          transition: 'border-color var(--transition)',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                  </div>
                  <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                        {t('support.subject')}
                      </label>
                      <input
                        required
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        placeholder={t('support.subjectPlaceholder')}
                      style={{
                        width: '100%', padding: '12px 16px',
                        background: 'var(--bg-alt)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                        fontSize: '0.95rem', outline: 'none',
                        transition: 'border-color var(--transition)',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                        {t('support.message')}
                      </label>
                      <textarea
                        required
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder={t('support.messagePlaceholder')}
                      rows={5}
                      style={{
                        width: '100%', padding: '12px 16px', resize: 'vertical',
                        background: 'var(--bg-alt)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', color: 'var(--text)',
                        fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit',
                        transition: 'border-color var(--transition)',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                    {t('support.send')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

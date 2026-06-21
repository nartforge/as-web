import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Register() {
  const { t } = useLanguage()
  const { register, loginWithDiscord } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      setError(t('auth.fillFields'))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(t('auth.invalidEmail'))
      return
    }
    if (form.password.length < 6) {
      setError(t('auth.passwordMinError'))
      return
    }
    if (form.password !== form.confirmPassword) {
      setError(t('auth.passwordMatch'))
      return
    }
    if (!acceptTerms) {
      setError(t('auth.acceptTerms'))
      return
    }

    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.registerFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
      <section className="section" style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div className="container">
          <div style={{ maxWidth: 440, margin: '0 auto' }}>
            <ScrollReveal className="text-center" style={{ marginBottom: 36 }}>
              <img src="/logo.png" alt="NartForge" style={{ height: 48, marginBottom: 16 }} />
              <h1 className="section-title" style={{ fontSize: '1.6rem' }}>{t('auth.registerTitle')}</h1>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                {t('auth.registerDesc')}
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="auth-card">
                <button onClick={loginWithDiscord} className="auth-discord-btn" type="button">
                  <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.2,60,73.2,53s5-12.74,11.44-12.74S96.14,46,96,53,91.08,65.69,84.69,65.69Z"/></svg>
                  {t('auth.discordContinue')}
                </button>

                <div className="auth-divider">
                  <span>{t('auth.orRegisterEmail')}</span>
                </div>

                {error && (
                  <div className="auth-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="auth-field">
                    <label htmlFor="name">{t('auth.name')}</label>
                    <input id="name" type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder={t('auth.namePlaceholder')} autoComplete="name" />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="reg-email">{t('auth.email')}</label>
                    <input id="reg-email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder={t('auth.emailPlaceholder')} autoComplete="email" />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="reg-password">{t('auth.password')}</label>
                    <input id="reg-password" type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder={t('auth.passwordMin')} autoComplete="new-password" />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="reg-confirm">{t('auth.confirmPassword')}</label>
                    <input id="reg-confirm" type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder={t('auth.confirmPlaceholder')} autoComplete="new-password" />
                  </div>
                  <label className="auth-checkbox" style={{ marginBottom: 20 }}>
                    <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} />
                    <span>{t('auth.terms')} <Link to="/" className="auth-link">{t('auth.termsConditions')}</Link></span>
                  </label>
                  <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? t('auth.creatingAccount') : t('auth.registerTitle')}
                  </button>
                </form>

                <p className="auth-footer-text">
                  {t('auth.hasAccount')} <Link to="/login" className="auth-link">{t('auth.signInLink')}</Link>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Login() {
  const { t } = useLanguage()
  const { login, loginWithDiscord } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError(t('auth.fillFields'))
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.loginFailed'))
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
              <h1 className="section-title" style={{ fontSize: '1.6rem' }}>{t('auth.signInTitle')}</h1>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                {t('auth.signInDesc')}
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="auth-card">
                <button onClick={loginWithDiscord} className="auth-discord-btn" type="button">
                  <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.2,60,73.2,53s5-12.74,11.44-12.74S96.14,46,96,53,91.08,65.69,84.69,65.69Z"/></svg>
                  {t('auth.discordContinue')}
                </button>

                <div className="auth-divider">
                  <span>{t('auth.orEmail')}</span>
                </div>

                {error && (
                  <div className="auth-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="auth-field">
                    <label htmlFor="email">{t('auth.email')}</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder')}
                      autoComplete="email"
                    />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="password">{t('auth.password')}</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder')}
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="auth-row">
                    <label className="auth-checkbox">
                      <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                      <span>{t('auth.remember')}</span>
                    </label>
                    <Link to="/forgot-password" className="auth-link">{t('auth.forgotPassword')}</Link>
                  </div>
                  <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? t('auth.signingIn') : t('auth.signIn')}
                  </button>
                </form>

                <p className="auth-footer-text">
                  {t('auth.noAccount')}{' '}<Link to="/register" className="auth-link">{t('auth.createOne')}</Link>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}

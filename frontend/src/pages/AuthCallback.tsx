import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { refreshSession } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '')
    const token = params.get('token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    authService.saveToken(token)
    refreshSession()
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => navigate('/login', { replace: true }))
  }, [navigate, refreshSession])

  return (
    <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
      <section className="section" style={{ paddingTop: 80, textAlign: 'center' }}>
        <div className="container">
          <h2>{t('auth.signingIn')}</h2>
        </div>
      </section>
    </div>
  )
}

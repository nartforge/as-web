import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import DiscordCTA from '../components/DiscordCTA'
import { useLanguage } from '../context/LanguageContext'
import { tReplace } from '../data/translations'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orders'
import { reviewService } from '../services/reviews'
import type { Order, Review } from '../types'

const statusColors: Record<string, string> = {
  pending: '#F59E0B',
  paid: '#22C55E',
  failed: '#EF4444',
  delivered: '#FF8A65',
  cancelled: '#6B7280',
}

export default function Dashboard() {
  const { t } = useLanguage()
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    setName(user.name)
    orderService.getByUser(user.id).then(setOrders)
    reviewService.getByUser(user.id).then(setReviews)
  }, [user, navigate])

  if (!user) return null

  const handleSaveProfile = async () => {
    if (name.trim()) {
      await updateProfile({ name: name.trim() })
      setEditing(false)
    }
  }

  return (
    <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
      <section className="section" style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div className="container">
          <ScrollReveal style={{ marginBottom: 40 }}>
            <h1 className="section-title">{t('dashboard.title')}</h1>
            <p className="section-subtitle" style={{ margin: '4px 0 0' }}>
              {tReplace(t('dashboard.welcome'), { name: user.name })}
            </p>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, alignItems: 'flex-start' }}>
            {/* Profile Card */}
            <ScrollReveal>
              <div className="card" style={{ padding: 28 }}>
                <div className="dash-avatar">
                  {user.avatar || user.discordAvatar ? (
                    <img src={user.avatar || user.discordAvatar} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {editing ? (
                  <div style={{ marginTop: 16 }}>
                    <div className="auth-field">
                      <label>{t('auth.name')}</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button onClick={handleSaveProfile} className="btn btn-primary" style={{ flex: 1 }}>{t('dashboard.save')}</button>
                      <button onClick={() => { setEditing(false); setName(user.name) }} className="btn" style={{ flex: 1, background: 'var(--bg-alt)' }}>{t('dashboard.cancel')}</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 style={{ margin: '16px 0 4px', fontWeight: 700 }}>{user.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>{user.email}</p>
                    {user.discordUsername && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 127.14 96.36" fill="#5865F2"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.2,60,73.2,53s5-12.74,11.44-12.74S96.14,46,96,53,91.08,65.69,84.69,65.69Z"/></svg>
                        {user.discordUsername}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                      <button onClick={() => setEditing(true)} className="btn" style={{ background: 'var(--bg-alt)', width: '100%' }}>{t('dashboard.editProfile')}</button>
                      <button onClick={logout} className="btn" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', width: '100%' }}>{t('dashboard.signOut')}</button>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 16 }}>
                      {tReplace(t('dashboard.memberSince'), { date: new Date(user.createdAt).toLocaleDateString() })}
                    </p>
                  </>
                )}
              </div>
            </ScrollReveal>

            {/* Orders & Reviews */}
            <div>
              {/* Orders */}
              <ScrollReveal style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  {t('dashboard.orders')}
                </h2>
                {orders.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>{t('dashboard.noOrders')}</p>
                    <Link to="/magaza" className="btn btn-primary">{t('dashboard.browseStore')}</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {orders.map(order => (
                      <div key={order.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', gap: 12 }}>
                        <div>
                          <h4 style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 2 }}>{order.productName}</h4>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{order.price} — {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            display: 'inline-block', padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize',
                            background: `${statusColors[order.status]}15`, color: statusColors[order.status],
                          }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollReveal>

              {/* Reviews */}
              <ScrollReveal>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {t('dashboard.myReviews')}
                </h2>
                {reviews.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>{t('dashboard.noReviews')}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {reviews.map(r => (
                      <div key={r.id} className="card" style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{r.productId}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= r.rating ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          ))}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollReveal>

              <ScrollReveal style={{ marginTop: 32 }}>
                <DiscordCTA variant="card" title={t('dashboard.joinDiscord')} description={t('dashboard.discordDesc')} />
              </ScrollReveal>
            </div>
          </div>

          <style>{`
            @media (max-width: 768px) {
              .dash-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </section>
    </div>
  )
}

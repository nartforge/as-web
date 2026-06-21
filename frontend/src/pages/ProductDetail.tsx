import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import DiscordCTA from '../components/DiscordCTA'
import { products } from '../data/products'
import { reviewService } from '../services/reviews'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { tReplace } from '../data/translations'
import { orderService } from '../services/orders'
import type { Review } from '../types'

const statusBadge: Record<string, { label: string; color: string }> = {
  active: { label: 'product.active', color: '#22C55E' },
  beta: { label: 'product.beta', color: '#F59E0B' },
  'coming-soon': { label: 'product.comingSoon', color: '#6B7280' },
  development: { label: 'product.inDevelopment', color: '#F59E0B' },
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const { t } = useLanguage()
  const product = products.find(p => p.id === slug)
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState({ average: 0, total: 0 })
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    if (!product) return
    reviewService.getByProduct(product.id).then(setReviews)
    reviewService.getAverageRating(product.id).then(setAvgRating)
  }, [product])

  if (!product) {
    return (
      <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
        <section className="section" style={{ paddingTop: 80, textAlign: 'center' }}>
          <h2>{t('product.notFound')}</h2>
          <Link to="/magaza" className="btn btn-primary" style={{ marginTop: 16 }}>{t('product.backToStore')}</Link>
        </section>
      </div>
    )
  }

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim() || newComment.length > 1000) return
    setSubmitting(true)
    try {
      await reviewService.add({
        productId: product.id,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar || user.discordAvatar,
        rating: newRating,
        comment: newComment.trim(),
      })
      setSubmitted(true)
      setNewComment('')
      setNewRating(5)
      const updated = await reviewService.getByProduct(product.id)
      setReviews(updated)
      setAvgRating(await reviewService.getAverageRating(product.id))
    } finally {
      setSubmitting(false)
    }
  }

  const similar = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3)

  return (
    <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
      <section className="section" style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div className="container">
          <ScrollReveal style={{ marginBottom: 32 }}>
            <Link to="/magaza" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              {t('product.backToStore')}
            </Link>
          </ScrollReveal>

          {/* Product Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 48 }}>
            <ScrollReveal>
              <div style={{
                borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                minHeight: 320,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: product.logo
                  ? `linear-gradient(135deg, ${product.accentColor || 'var(--primary)'}15, ${product.accentColor || 'var(--primary)'}05)`
                  : 'var(--bg-alt)',
                padding: 40,
              }}>
                {product.logo ? (
                  <img src={product.logo} alt={product.name}
                    style={{ width: '100%', height: '100%', maxWidth: 280, maxHeight: 280, objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{
                    width: 120, height: 120, borderRadius: 'var(--radius-lg)',
                    background: `linear-gradient(135deg, ${product.accentColor || 'var(--primary)'}, ${product.accentColor || 'var(--primary)'}cc)`,
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '3rem', fontWeight: 700,
                  }}>
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
                    color: 'var(--primary)', background: 'rgba(230,81,0,0.1)',
                    padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                  }}>
                    {product.category.replace('-', ' ')}
                  </span>
                  {product.badge && (
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
                      color: '#fff', background: 'var(--gradient-primary)',
                      padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                    }}>
                      {product.badge.replace('-', ' ')}
                    </span>
                  )}
                  {product.status && (
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
                      color: statusBadge[product.status].color,
                      background: `${statusBadge[product.status].color}15`,
                      padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                    }}>
                      {t(statusBadge[product.status].label)}
                    </span>
                  )}
                </div>

                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{product.name}</h1>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {product.longDescription}
                </p>

                {product.version && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {t('product.version')}: <strong>{product.version}</strong>
                    {product.updated && <> — {tReplace(t('product.updated'), { date: product.updated })}</>}
                  </p>
                )}

                {avgRating.total > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= avgRating.average ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      ))}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{avgRating.average}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({avgRating.total} {avgRating.total === 1 ? t('product.review_one') : t('product.review_other')})</span>
                  </div>
                )}

                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{product.price}</h2>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                  <button onClick={() => setShowCheckout(true)} className="btn btn-primary" style={{ padding: '14px 28px' }}>
                    {t('product.buyNow')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                  <Link to={`/wiki`} className="btn" style={{ padding: '14px 24px', background: 'var(--bg-alt)' }}>
                    {t('product.viewWiki')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </Link>
                  <DiscordCTA variant="inline" title={t('product.contactSupport')} />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <ScrollReveal style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>{t('product.features')}</h2>
              <div className="grid-3">
                {product.features.map((f, i) => (
                  <div key={i} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize: '0.92rem' }}>{f}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Requirements */}
          {product.requirements && product.requirements.length > 0 && (
            <ScrollReveal style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>{t('product.requirements')}</h2>
              <div className="card" style={{ padding: '24px 28px' }}>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {product.requirements.map((r, i) => (
                    <li key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r}</li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          )}

          {/* Reviews */}
          <ScrollReveal style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {t('product.reviews')}
              {avgRating.total > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 400 }}>({avgRating.total})</span>}
            </h2>

            {/* Review Form */}
            {user ? (
              submitted ? (
                <div className="card" style={{ textAlign: 'center', padding: '32px 24px', marginBottom: 24 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <p style={{ marginTop: 8, fontWeight: 600 }}>{t('product.reviewSubmitted')}</p>
                </div>
              ) : (
                <form onSubmit={handleReview} className="card" style={{ padding: '24px 28px', marginBottom: 24 }}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', marginBottom: 8 }}>{t('product.reviewRating')}</label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setNewRating(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill={s <= newRating ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="auth-field">
                    <label htmlFor="comment">{t('product.yourReview')}</label>
                    <textarea
                      id="comment"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder={t('product.reviewPlaceholder')}
                      rows={4}
                      maxLength={1000}
                      style={{ resize: 'vertical', fontFamily: 'inherit' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', display: 'block', marginTop: 4 }}>
                      {newComment.length}/1000
                    </span>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submitting || !newComment.trim()}>
                    {submitting ? t('common.submitting') : t('product.submitReview')}
                  </button>
                </form>
              )
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '32px 24px', marginBottom: 24 }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>{t('product.loginToReview')}</p>
                <Link to="/login" className="btn btn-primary">{t('product.signIn')}</Link>
              </div>
            )}

            {/* Review List */}
            {reviews.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                <p style={{ color: 'var(--text-muted)' }}>{t('product.noReviews')}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reviews.map(r => (
                  <div key={r.id} className="card" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'var(--gradient-primary)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.85rem',
                        }}>
                          {r.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.userName}</span>
                          {r.isVerifiedBuyer && (
                            <span style={{
                              fontSize: '0.7rem', marginLeft: 6, padding: '1px 6px',
                              borderRadius: 'var(--radius-sm)', background: 'rgba(37, 99, 235, 0.1)',
                              color: '#E65100', fontWeight: 600,
                            }}>
                              {t('product.verifiedBuyer')}
                            </span>
                          )}
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0 }}>
                            {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= r.rating ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        ))}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.88rem' }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>

          {/* Similar Products */}
          {similar.length > 0 && (
            <ScrollReveal>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>{t('product.similar')}</h2>
              <div className="grid-3">
                {similar.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} className="card" style={{ padding: '24px', textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{p.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 12 }}>
                      {p.description}
                    </p>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.price}</span>
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Bottom CTA */}
          <ScrollReveal style={{ marginTop: 48 }}>
            <div className="card" style={{
              textAlign: 'center', padding: '48px 32px',
              background: 'linear-gradient(135deg, rgba(230,81,0,0.05), rgba(230,81,0,0.02))',
              border: '1px solid rgba(230,81,0,0.15)',
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>{t('product.needHelp')}</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.7 }}>
                {tReplace(t('product.needHelpDesc'), { name: product.name })}
              </p>
              <DiscordCTA variant="hero" title={t('product.contactSupport')} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
          <div className="checkout-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCheckout(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <CheckoutContent product={product} onClose={() => setShowCheckout(false)} />
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
          .checkout-modal { width: 95% !important; margin: 20px auto !important; }
        }
      `}</style>
    </div>
  )
}

function CheckoutContent({ product, onClose }: { product: typeof products[0]; onClose: () => void }) {
  const { user: authUser, loginWithDiscord } = useAuth()
  const { t } = useLanguage()
  const [checkoutStep, setCheckoutStep] = useState<'payment' | 'processing' | 'complete'>(authUser ? 'payment' : 'payment')
  const [selectedMethod, setSelectedMethod] = useState<'shopier'>('shopier')
  const [orderStatus, setOrderStatus] = useState<string | null>(null)

  const handlePayment = async () => {
    setCheckoutStep('processing')
      const order = await orderService.create({
      userId: authUser!.id,
      productId: product.id,
      productName: product.name,
      price: product.price,
      paymentMethod: selectedMethod,
      paymentProvider: 'shopier',
      status: 'pending',
    })
    setOrderStatus(order.id)
    setCheckoutStep('complete')

    if (order.shopierPaymentUrl) {
      window.open(order.shopierPaymentUrl, '_blank')
    }
  }

  if (!authUser) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" style={{ marginBottom: 16 }}><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        <h3 style={{ marginBottom: 8 }}>{t('checkout.signInToPurchase')}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>{t('checkout.signInToPurchaseDesc')}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={loginWithDiscord} className="auth-discord-btn" style={{ display: 'inline-flex', padding: '12px 24px' }}>
            <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.2,60,73.2,53s5-12.74,11.44-12.74S96.14,46,96,53,91.08,65.69,84.69,65.69Z"/></svg>
            {t('checkout.discordLogin')}
          </button>
          <a href="/login" className="btn btn-primary" style={{ padding: '12px 24px' }}>{t('auth.signIn')}</a>
        </div>
      </div>
    )
  }

  if (checkoutStep === 'complete') {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" style={{ marginBottom: 16 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <h3 style={{ marginBottom: 8 }}>{t('checkout.orderPlaced')}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 4, lineHeight: 1.6 }}>
          {tReplace(t('checkout.orderFor'), { name: product.name })}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
          {tReplace(t('checkout.orderStatus'), { id: orderStatus!, status: t('checkout.orderPending') })}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
          {t('checkout.redirectShopierDesc')}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <a href="/dashboard" className="btn btn-primary">{t('checkout.viewOrders')}</a>
          <button onClick={onClose} className="btn" style={{ background: 'var(--bg-alt)' }}>{t('checkout.close')}</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Product Summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '16px 20px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 'var(--radius-md)',
          background: 'var(--gradient-primary)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{product.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{product.description}</p>
          <p style={{ fontWeight: 700, color: 'var(--primary)', marginTop: 4, fontSize: '1.1rem' }}>{product.price}</p>
        </div>
      </div>

      {/* User Info */}
      <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(37,99,235,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8A65" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {tReplace(t('checkout.purchasingAs'), { name: authUser.name, email: authUser.email })}
        </span>
      </div>

      {/* Payment Method */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 12, display: 'block' }}>{t('checkout.paymentMethod')}</label>
        <label className="checkout-method" style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
          borderRadius: 'var(--radius-md)', border: selectedMethod === 'shopier' ? '2px solid var(--primary)' : '1px solid var(--border)',
          cursor: 'pointer', transition: 'all var(--transition)',
          background: selectedMethod === 'shopier' ? 'rgba(230,81,0,0.04)' : 'var(--bg-card)',
        }}>
          <input type="radio" checked={selectedMethod === 'shopier'} onChange={() => setSelectedMethod('shopier')} style={{ accentColor: 'var(--primary)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{t('checkout.shopier')}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t('checkout.shopierDesc')}</div>
          </div>
          <div style={{
            padding: '4px 10px', background: '#E8F5E9', color: '#2E7D32',
            borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 600,
          }}>
            {t('checkout.secure')}
          </div>
        </label>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
          <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.product')}</span>
          <span style={{ fontWeight: 600 }}>{product.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
          <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.total')}</span>
          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>{product.price}</span>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 16, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        {t('checkout.secureCheckout')}
      </p>

      <button onClick={handlePayment} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1rem' }} disabled={checkoutStep === 'processing'}>
        {checkoutStep === 'processing' ? t('checkout.processing') : tReplace(t('checkout.continueWithPrice'), { price: product.price })}
      </button>
    </div>
  )
}

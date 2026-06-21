import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import DiscordCTA from '../components/DiscordCTA'
import { getProductDetailBySlug, productDetails } from '../data/productDetails'
import { reviewService } from '../services/reviews'
import { orderService } from '../services/orders'
import { productApi } from '../services/productApi'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { tReplace } from '../data/translations'
import { useCart } from '../context/CartContext'
import type { Review, ProductCommand, ErrorSolution, ProductDetail } from '../types'

const severityColors: Record<string, { bg: string; color: string }> = {
  critical: { bg: 'rgba(239,68,68,0.08)', color: '#EF4444' },
  common: { bg: 'rgba(245,158,11,0.08)', color: '#F59E0B' },
  'easy-fix': { bg: 'rgba(34,197,94,0.08)', color: '#22C55E' },
}

const statusBadge: Record<string, { label: string; color: string }> = {
  active: { label: 'product.active', color: '#22C55E' },
  beta: { label: 'product.beta', color: '#F59E0B' },
  'coming-soon': { label: 'product.comingSoon', color: '#6B7280' },
  development: { label: 'product.inDevelopment', color: '#F59E0B' },
}

const sections = ['Features', 'Installation', 'Commands', 'Errors', 'Reviews'] as const
type Section = typeof sections[number]

function CopyBtn({ text }: { text: string }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button className="wiki-copy-btn" onClick={handle} title={t('common.copied')}>
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      )}
    </button>
  )
}

function CheckoutContent({ product, onClose }: { product: ProductDetail; onClose: () => void }) {
  const { user: authUser, loginWithDiscord } = useAuth()
  const { t } = useLanguage()
  const [checkoutStep, setCheckoutStep] = useState<'payment' | 'processing' | 'complete'>(authUser ? 'payment' : 'payment')
  const [selectedMethod] = useState<'shopier'>('shopier')
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
          <Link to="/login" className="btn btn-primary" style={{ padding: '12px 24px' }}>{t('auth.signIn')}</Link>
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
          <Link to="/dashboard" className="btn btn-primary">{t('checkout.viewOrders')}</Link>
          <button onClick={onClose} className="btn" style={{ background: 'var(--bg-alt)' }}>{t('checkout.close')}</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '16px 20px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--gradient-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{product.name}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{product.shortDescription}</p>
          <p style={{ fontWeight: 700, color: 'var(--primary)', marginTop: 4, fontSize: '1.1rem' }}>{product.price}</p>
        </div>
      </div>
      <div style={{ marginBottom: 20, padding: '12px 16px', background: 'rgba(37,99,235,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF8A65" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {tReplace(t('checkout.purchasingAs'), { name: authUser.name, email: authUser.email })}
        </span>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 12, display: 'block' }}>{t('checkout.paymentMethod')}</label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '2px solid var(--primary)', cursor: 'pointer', transition: 'all var(--transition)', background: 'rgba(230,81,0,0.04)' }}>
          <input type="radio" checked={true} readOnly style={{ accentColor: 'var(--primary)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{t('checkout.shopier')}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t('checkout.shopierDesc')}</div>
          </div>
          <div style={{ padding: '4px 10px', background: '#E8F5E9', color: '#2E7D32', borderRadius: 'var(--radius-sm)', fontSize: '0.72rem', fontWeight: 600 }}>{t('checkout.secure')}</div>
        </label>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8 }}>
          <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.product')}</span>
          <span style={{ fontWeight: 600 }}>{product.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
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

function CommandCard({ cmd }: { cmd: ProductCommand }) {
  return (
    <div className="wiki-cmd-card">
      <div className="wiki-cmd-header">
        <code className="wiki-cmd-code">{cmd.command}</code>
        <CopyBtn text={cmd.command} />
      </div>
      <p className="wiki-cmd-desc">{cmd.description}</p>
      <div className="wiki-cmd-footer">
        <span className="wiki-perm-badge">{cmd.permission}</span>
        <span className="wiki-cmd-example" onClick={() => navigator.clipboard.writeText(cmd.example)} title="Click to copy">{cmd.example}</span>
      </div>
    </div>
  )
}

function ErrorCard({ error, defaultOpen }: { error: ErrorSolution; defaultOpen: boolean }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(defaultOpen)
  const sc = severityColors[error.severity] || severityColors.common
  return (
    <div className={`wiki-error-card${open ? ' open' : ''}`}>
      <button className="wiki-error-header" onClick={() => setOpen(!open)}>
        <span className="wiki-severity-badge" style={{ background: sc.bg, color: sc.color }}>{error.severity}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="wiki-error-title">{error.title}</span>
          <span className="wiki-error-msg">{error.errorMessage}</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition)', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className="wiki-error-body">
          <div className="wiki-error-section">
            <strong>{t('wiki.possibleCause')}</strong>
            <p>{error.possibleCause}</p>
          </div>
          <div className="wiki-error-section">
            <strong>{t('wiki.solution')}</strong>
            <p>{error.solution}</p>
          </div>
          <button className="wiki-error-support" onClick={() => window.open('https://discord.gg/6N8B4aMJkw', '_blank')}>
            <svg width="16" height="16" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.2,60,73.2,53s5-12.74,11.44-12.74S96.14,46,96,53,91.08,65.69,84.69,65.69Z"/></svg>
            {t('wiki.needHelp')} {t('wiki.contactSupport')}
          </button>
        </div>
      )}
    </div>
  )
}

export default function StoreProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const { t } = useLanguage()
  const { addItem } = useCart()
  const fallbackProduct = getProductDetailBySlug(slug || '')
  const [remoteProduct, setRemoteProduct] = useState<ProductDetail | null>(null)
  const product = remoteProduct || fallbackProduct
  const [activeSection, setActiveSection] = useState<Section>('Features')
  const [reviews, setReviews] = useState<Review[]>([])
  const [avgRating, setAvgRating] = useState({ average: 0, total: 0 })
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (!slug) return
    productApi.getProductBySlug(slug)
      .then(setRemoteProduct)
      .catch(error => console.warn('Backend product detail unavailable, using local data', error))
  }, [slug])

  useEffect(() => {
    if (!product) return
    reviewService.getByProduct(product.id).then(setReviews)
    reviewService.getAverageRating(product.id).then(setAvgRating)
  }, [product?.id])

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

  const accent = product.accentColor || 'var(--primary)'
  const similar = productDetails.filter(p => p.id !== product.id && p.mainCategory === product.mainCategory).slice(0, 3)

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

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.logo,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const sectionLabels: Record<Section, string> = {
    Features: t('product.features'),
    Installation: t('product.installation'),
    Commands: t('product.commands'),
    Errors: t('product.errors'),
    Reviews: t('product.reviews'),
  }

  const sectionIds: Record<Section, string> = {
    Features: 'section-features',
    Installation: 'section-installation',
    Commands: 'section-commands',
    Errors: 'section-errors',
    Reviews: 'section-reviews',
  }

  const scrollToSection = (section: Section) => {
    setActiveSection(section)
    const el = document.getElementById(sectionIds[section])
    if (el) {
      const offset = 120
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
      <section className="section" style={{ paddingTop: 24, paddingBottom: 100 }}>
        <div className="container">
          <ScrollReveal style={{ marginBottom: 24 }}>
            <Link to="/magaza" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              {t('product.backToStore')}
            </Link>
          </ScrollReveal>

          <div className="store-detail-layout">
            {/* ===== Left: Content ===== */}
            <main className="store-detail-content">
              {/* Product Hero */}
              <ScrollReveal>
                <div style={{ display: 'flex', gap: 28, marginBottom: 32, padding: '28px 32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{
                    width: 120, height: 120, borderRadius: 'var(--radius-md)', flexShrink: 0,
                    background: 'var(--bg-alt)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12,
                  }}>
                    {product.logo ? (
                      <img src={product.logo} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                        {product.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                      {product.badges.map(b => (
                        <span key={b} style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: '#fff', background: 'var(--gradient-primary)', padding: '2px 10px', borderRadius: 'var(--radius-sm)' }}>{b}</span>
                      ))}
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', color: statusBadge[product.status]?.color, background: `${statusBadge[product.status]?.color}15`, padding: '3px 10px', borderRadius: 'var(--radius-sm)' }}>
                        {statusBadge[product.status] ? t(statusBadge[product.status].label) : product.status}
                      </span>
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>{product.name}</h1>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>{product.longDescription}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                      {product.version && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('product.version')}: <strong>{product.version}</strong></span>}
                      {avgRating.total > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ display: 'flex', gap: 2 }}>
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= avgRating.average ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            ))}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{avgRating.average}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>({avgRating.total})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Section Navigation */}
              <ScrollReveal>
                <div className="store-detail-tabs" style={{
                  display: 'flex', gap: 0, background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 28,
                  position: 'sticky', top: 'var(--nav-height)', zIndex: 10,
                }}>
                  {sections.map(s => (
                    <button
                      key={s}
                      onClick={() => scrollToSection(s)}
                      style={{
                        flex: 1, padding: '14px 16px', fontSize: '0.85rem', fontWeight: activeSection === s ? 700 : 500,
                        color: activeSection === s ? 'var(--primary)' : 'var(--text-secondary)',
                        background: activeSection === s ? 'rgba(230,81,0,0.06)' : 'transparent',
                        border: 'none', borderBottom: activeSection === s ? '2px solid var(--primary)' : '2px solid transparent',
                        cursor: 'pointer', transition: 'all var(--transition)', whiteSpace: 'nowrap',
                      }}
                    >
                      {sectionLabels[s]}
                    </button>
                  ))}
                </div>
              </ScrollReveal>

              {/* Features */}
              <div id="section-features">
                <ScrollReveal>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>{t('product.features')}</h2>
                  <div className="grid-3">
                    {product.features.map((f, i) => (
                      <div key={i} className="card" style={{ padding: '20px 24px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        {f.icon && <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{f.icon}</span>}
                        <div>
                          <h3 style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 4 }}>{f.title}</h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Installation */}
              <div id="section-installation" style={{ marginTop: 48 }}>
                <ScrollReveal>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>{t('product.installation')}</h2>
                  <div className="card" style={{ padding: '24px 28px' }}>
                    {product.requirements && product.requirements.length > 0 && (
                      <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 'var(--radius-md)' }}>
                        <strong style={{ fontSize: '0.82rem', color: '#F59E0B' }}>{t('product.requirements')}:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                          {product.requirements.map((r, i) => (
                            <span key={i} className="tag tag-muted" style={{ fontSize: '0.78rem' }}>{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {product.installationSteps.map(step => (
                        <div key={step.step} className={`wiki-step wiki-step-${step.type || 'info'}`} style={{ display: 'flex', gap: 14, padding: '16px 20px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', alignItems: 'flex-start' }}>
                          <div className="wiki-step-number" style={{
                            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0, color: '#fff',
                            background: step.type === 'warning' ? '#F59E0B' : step.type === 'success' ? '#22C55E' : '#FF8A65',
                          }}>
                            {step.step}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 className="wiki-step-title">{step.title}</h4>
                            <p className="wiki-step-desc">{step.description}</p>
                            {step.code && (
                              <div style={{ position: 'relative', marginTop: 8 }}>
                                <pre className="wiki-code-block" style={{ padding: '10px 14px', fontSize: '0.8rem' }}>{step.code}</pre>
                                <button className="wiki-copy-btn" onClick={() => { navigator.clipboard.writeText(step.code || '') }} style={{ position: 'absolute', top: 6, right: 6 }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Commands */}
              <div id="section-commands" style={{ marginTop: 48 }}>
                <ScrollReveal>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>{t('product.commands')}</h2>
                  <div className="card" style={{ padding: '24px 28px' }}>
                    <div className="wiki-cmd-grid">
                      {product.commands.map((cmd, i) => (
                        <CommandCard key={i} cmd={cmd} />
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Errors */}
              <div id="section-errors" style={{ marginTop: 48 }}>
                <ScrollReveal>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>{t('product.errors')}</h2>
                  <div className="card" style={{ padding: '24px 28px' }}>
                    {product.errorSolutions.map((err, i) => (
                      <ErrorCard key={err.id} error={err} defaultOpen={i === 0} />
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Reviews */}
              <div id="section-reviews" style={{ marginTop: 48 }}>
                <ScrollReveal>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {t('product.reviews')}
                    {avgRating.total > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 400 }}>({avgRating.total})</span>}
                  </h2>

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
                          <label htmlFor="sd-comment">{t('product.yourReview')}</label>
                          <textarea id="sd-comment" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder={t('product.reviewPlaceholder')} rows={4} maxLength={1000} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', display: 'block', marginTop: 4 }}>{newComment.length}/1000</span>
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
                              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                                {r.userName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.userName}</span>
                                {r.isVerifiedBuyer && (
                                  <span style={{ fontSize: '0.7rem', marginLeft: 6, padding: '1px 6px', borderRadius: 'var(--radius-sm)', background: 'rgba(37, 99, 235, 0.1)', color: '#E65100', fontWeight: 600 }}>{t('product.verifiedBuyer')}</span>
                                )}
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0 }}>{new Date(r.createdAt).toLocaleDateString()}</p>
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
              </div>

              {/* Similar Products */}
              {similar.length > 0 && (
                <ScrollReveal style={{ marginTop: 48 }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 20 }}>{t('product.similar')}</h2>
                  <div className="grid-3">
                    {similar.map(p => (
                      <Link key={p.id} to={`/store/${p.slug}`} className="card" style={{ padding: '24px', textDecoration: 'none', color: 'inherit' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{p.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 12 }}>{p.shortDescription}</p>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.price}</span>
                      </Link>
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </main>

            {/* ===== Right: Sidebar ===== */}
            <aside className="store-detail-sidebar" style={{
              width: 320, flexShrink: 0,
              position: 'sticky', top: 'calc(var(--nav-height) + 24px)', alignSelf: 'flex-start',
            }}>
              <div className="card" style={{ marginBottom: 20 }}>
                {/* Logo */}
                <div style={{
                  width: '100%', height: 140, borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-alt)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, marginBottom: 16,
                }}>
                  {product.logo ? (
                    <img src={product.logo} alt={product.name} style={{ width: 'auto', height: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
                      {product.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{product.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 16, lineHeight: 1.5 }}>{product.shortDescription}</p>

                {/* Price */}
                <div style={{ fontSize: '1.8rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 20 }}>
                  {product.price}
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '14px', fontSize: '0.95rem', marginBottom: 12, justifyContent: 'center' }}
                  disabled={addedToCart}
                >
                  {addedToCart ? (
                    <>{t('product.addedToCart')}</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                      {t('product.addToCart')}
                    </>
                  )}
                </button>

                {/* Buy Now */}
                <button
                  onClick={() => setShowCheckout(true)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '0.95rem', justifyContent: 'center', marginBottom: 20 }}
                >
                  {t('product.buyNow')}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>

                {/* Requirements */}
                {product.requirements.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>{t('product.requirements')}</h4>
                    <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {product.requirements.map((r, i) => (
                        <li key={i} style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Compatibility */}
                {product.compatibility.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>{t('product.compatibility')}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {product.compatibility.map((c, i) => (
                        <span key={i} className="tag tag-primary" style={{ fontSize: '0.75rem' }}>{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Use Cases */}
                {product.useCases.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>{t('product.useCases')}</h4>
                    <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {product.useCases.map((u, i) => (
                        <li key={i} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>{u}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Support */}
                <DiscordCTA variant="inline" title={t('product.needHelp')} style={{ width: '100%', justifyContent: 'center', padding: '12px' }} />
              </div>
            </aside>
          </div>

          <style>{`
            .store-detail-layout {
              display: flex;
              gap: 32px;
              align-items: flex-start;
            }
            .store-detail-content {
              flex: 1;
              min-width: 0;
            }
            .store-detail-sidebar {
              width: 320px;
              flex-shrink: 0;
            }
            @media (max-width: 1024px) {
              .store-detail-layout { flex-direction: column; }
              .store-detail-sidebar {
                width: 100% !important;
                position: static !important;
              }
            }
            @media (max-width: 768px) {
              .store-detail-tabs { overflow-x: auto; }
              .store-detail-tabs button { font-size: 0.78rem !important; padding: 12px !important; }
            }
          `}</style>
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
    </div>
  )
}

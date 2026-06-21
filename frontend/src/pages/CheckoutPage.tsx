import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import { getProductDetailBySlug } from '../data/productDetails'
import { products } from '../data/products'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { tReplace } from '../data/translations'
import { useCart } from '../context/CartContext'
import { orderService } from '../services/orders'

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>()
  const detail = getProductDetailBySlug(slug || '')
  const product = products.find(p => p.id === detail?.id)
  const { user, loginWithDiscord } = useAuth()
  const { t } = useLanguage()
  const { addItem } = useCart()

  const [step, setStep] = useState<'cart' | 'payment' | 'processing' | 'complete'>(
    user ? 'cart' : 'cart'
  )
  const [orderStatus, setOrderStatus] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  if (!detail || !product) {
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

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.logo,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handlePayment = async () => {
    if (!user) return
    setStep('processing')
    const order = await orderService.create({
      userId: user.id,
      productId: product.id,
      productName: product.name,
      price: product.price,
      paymentMethod: 'shopier',
      paymentProvider: 'shopier',
      status: 'pending',
    })
    setOrderStatus(order.id)
    setStep('complete')
    if (order.shopierPaymentUrl) {
      window.open(order.shopierPaymentUrl, '_blank')
    }
  }

  return (
    <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
      <section className="section" style={{ paddingTop: 24, paddingBottom: 100 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          {step === 'complete' && orderStatus ? (
            <ScrollReveal>
              <div className="card" style={{ textAlign: 'center', padding: '80px 32px' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" style={{ marginBottom: 20 }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h2 style={{ marginBottom: 8, fontSize: '1.8rem' }}>{t('checkout.orderPlaced')}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
                  {tReplace(t('checkout.orderFor'), { name: product.name })}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 24 }}>
                  {tReplace(t('checkout.orderStatus'), { id: orderStatus!, status: t('checkout.orderPending') })}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 32 }}>
                  {t('checkout.redirectShopierDesc')}
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <Link to="/dashboard" className="btn btn-primary" style={{ padding: '14px 28px' }}>{t('checkout.viewOrders')}</Link>
                  <Link to="/magaza" className="btn" style={{ padding: '14px 28px', background: 'var(--bg-alt)' }}>{t('checkout.continueShopping')}</Link>
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <>
              <ScrollReveal style={{ marginBottom: 28 }}>
                <Link to={`/store/${slug}`} style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  {t('checkout.backToProduct')}
                </Link>
              </ScrollReveal>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'flex-start' }}>
                {/* ===== Left: Product Details ===== */}
                <div>
                  <ScrollReveal>
                    <div className="card" style={{ padding: '28px 32px', marginBottom: 24 }}>
                      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                        <div style={{
                          width: 88, height: 88, borderRadius: 'var(--radius-md)', flexShrink: 0,
                          background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10,
                        }}>
                          {product.logo ? (
                            <img src={product.logo} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700 }}>
                              {product.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>{product.name}</h2>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{detail.longDescription}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                            {detail.badges.slice(0, 3).map(b => (
                              <span key={b} style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', color: '#fff', background: 'var(--gradient-primary)', padding: '2px 10px', borderRadius: 'var(--radius-sm)' }}>{b}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>{t('checkout.productDetails')}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {detail.features.slice(0, 6).map((f, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {f.icon && <span style={{ flexShrink: 0 }}>{f.icon}</span>}
                            <span><strong style={{ color: 'var(--text)' }}>{f.title}</strong> — {f.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Refund Policy */}
                  <ScrollReveal>
                    <div className="card" style={{ padding: '24px 28px', marginBottom: 24 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        {t('checkout.refundPolicy')}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        <p>{t('checkout.refundIntro')}</p>
                        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <li>{t('checkout.refund1')}</li>
                          <li>{t('checkout.refund2')}</li>
                          <li>{t('checkout.refund3')}</li>
                          <li>{t('checkout.refund4')}</li>
                        </ul>
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* User Manual */}
                  <ScrollReveal>
                    <div className="card" style={{ padding: '24px 28px', marginBottom: 24 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8A65" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        {t('checkout.userManual')}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        <p>{t('checkout.manualIntro')}</p>
                        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <li>{t('checkout.manual1')}</li>
                          <li>{t('checkout.manual2')}</li>
                          <li>{t('checkout.manual3')}</li>
                        </ul>
                        <Link to="/wiki" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          {t('checkout.browseWiki')}
                        </Link>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                {/* ===== Right: Cart + Payment ===== */}
                <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 24px)' }}>
                  <ScrollReveal>
                    <div className="card" style={{ padding: '24px' }}>
                      {/* Product summary */}
                      <div style={{
                        display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20,
                        padding: '12px 14px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)',
                      }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                          background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4,
                        }}>
                          {product.logo ? (
                            <img src={product.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <span style={{ fontWeight: 700, color: accent }}>{product.name.charAt(0)}</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t('checkout.digitalProduct')}</div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>{product.price}</div>
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={handleAddToCart}
                        className="btn btn-secondary"
                        style={{ width: '100%', padding: '12px', fontSize: '0.9rem', justifyContent: 'center', marginBottom: 16 }}
                        disabled={added}
                      >
                        {added ? t('checkout.addedToCart') : t('checkout.addToCart')}
                      </button>

                      {/* Payment Method */}
                      {step === 'cart' && (
                        <>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>{t('checkout.paymentMethod')}</h4>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', marginBottom: 16,
                            borderRadius: 'var(--radius-md)', border: '2px solid var(--primary)',
                            background: 'rgba(230,81,0,0.04)',
                          }}>
                            <input type="radio" checked={true} readOnly style={{ accentColor: 'var(--primary)' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t('checkout.shopier')}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t('checkout.creditCard')}</div>
                            </div>
                            <span style={{ padding: '2px 8px', background: '#E8F5E9', color: '#2E7D32', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem', fontWeight: 600 }}>{t('checkout.secure')}</span>
                          </div>
                        </>
                      )}

                      {/* Buy / Auth */}
                      {user ? (
                        step === 'cart' ? (
                          <button
                            onClick={() => setStep('payment')}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '14px', fontSize: '0.95rem', justifyContent: 'center' }}
                          >
                            {tReplace(t('checkout.buyNow'), { price: product.price })}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                          </button>
                        ) : (
                          <div style={{ marginTop: 16 }}>
                            <div style={{
                              display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 16,
                              padding: '12px 14px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)',
                            }}>
                              <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.total')}</span>
                              <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>{product.price}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                              {t('checkout.redirectShopier')}
                            </p>
                            <button onClick={handlePayment} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }} disabled={step === 'processing'}>
                              {step === 'processing' ? t('checkout.processing') : tReplace(t('checkout.payWithPrice'), { price: product.price })}
                            </button>
                          </div>
                        )
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <button
                            onClick={loginWithDiscord}
                            className="auth-discord-btn"
                            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.9rem' }}
                          >
                            <svg width="16" height="16" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.2,60,73.2,53s5-12.74,11.44-12.74S96.14,46,96,53,91.08,65.69,84.69,65.69Z"/></svg>
                            {t('checkout.loginWithDiscord')}
                          </button>
                          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('auth.signInLink')}</Link>
                          </p>
                        </div>
                      )}

                      {/* Divider */}
                      <div style={{ borderTop: '1px solid var(--border)', marginTop: 20, paddingTop: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)', justifyContent: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          {t('checkout.secureCheckout')}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>

              <style>{`
                @media (max-width: 768px) {
                  .container > div:first-of-type { grid-template-columns: 1fr !important; }
                }
              `}</style>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

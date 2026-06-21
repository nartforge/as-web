import { useEffect, useState } from 'react'
import ScrollReveal from '../components/ScrollReveal'
import ProductCard from '../components/ProductCard'
import DiscordCTA from '../components/DiscordCTA'
import { storeProducts, categoryStructure } from '../data/products'
import type { Product } from '../data/products'
import { useLanguage } from '../context/LanguageContext'
import { productApi } from '../services/productApi'

export default function Store() {
  const { t } = useLanguage()
  const [activeMain, setActiveMain] = useState('minecraft')
  const [activeSub, setActiveSub] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>(storeProducts)

  useEffect(() => {
    productApi.getProducts()
      .then(items => setProducts(items.filter(p => p.status !== 'coming-soon')))
      .catch(error => console.warn('Backend products unavailable, using local data', error))
  }, [])

  const trustItems = [
    { icon: '🔒', label: t('store.securePayment') },
    { icon: '⚡', label: t('store.instantDelivery') },
    { icon: '🔄', label: t('store.lifetimeUpdates') },
    { icon: '🛡️', label: t('store.premiumSupport') },
    { icon: '✅', label: t('store.verifiedProducts') },
    { icon: '🚀', label: t('store.fastSetup') },
  ]

  const trustStats = [
    { value: '50+', label: t('store.productsDelivered') },
    { value: 'Fast', label: t('store.setup') },
    { value: '100%', label: t('store.secure') },
    { value: '24/7', label: t('store.support') },
  ]

  const currentCategory = categoryStructure.find(c => c.id === activeMain)!

  const filtered = products.filter(p => {
    if (p.mainCategory !== activeMain) return false
    if (activeSub && p.subCategory !== activeSub) return false
    return true
  })

  const recommended = products.filter(p => p.badge || p.status === 'active').slice(0, 3)

  return (
    <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
      <section className="section" style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div className="container">

          {/* ===== Hero ===== */}
          <ScrollReveal style={{ marginBottom: 16 }}>
            <div className="store-hero">
              <div className="store-hero-bg" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="section-label">{t('store.heroLabel')}</span>
                <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>{t('store.title')}</h1>
                <p className="section-subtitle" style={{ maxWidth: 560, margin: '0 auto 24px' }}>
                  {t('store.subtitle')}
                </p>
                <div className="store-hero-actions">
                  <button
                    onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn btn-primary" style={{ padding: '14px 28px' }}
                  >
                    {t('store.browse')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                  <DiscordCTA title={t('store.requestCustom')} variant="inline" style={{ padding: '14px 24px', fontSize: '0.95rem' }} />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ===== Trust Bar ===== */}
          <ScrollReveal>
            <div className="store-trust-bar">
              {trustItems.map(item => (
                <div key={item.label} className="store-trust-item">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* ===== Stats Bar ===== */}
          <ScrollReveal>
            <div className="store-stats-bar">
              {trustStats.map(s => (
                <div key={s.label} className="store-stat-item">
                  <div className="store-stat-value">{s.value}</div>
                  <div className="store-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* ===== Products Section ===== */}
          <div id="products" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }} className="store-layout">
            {/* Sidebar */}
            <aside className="store-sidebar" style={{
              flexShrink: 0,
              width: 240,
              position: 'sticky',
              top: 'calc(var(--nav-height) + 40px)',
            }}>
              <nav style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}>
                {categoryStructure.map(cat => {
                  const isActive = activeMain === cat.id
                  return (
                    <div key={cat.id}>
                      <button
                        onClick={() => {
                          setActiveMain(cat.id)
                          setActiveSub(cat.subCategories.length > 0 ? cat.subCategories[0]! : null)
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                          background: isActive ? 'rgba(230, 81, 0, 0.1)' : 'transparent',
                          fontSize: '0.95rem',
                          transition: 'all var(--transition)',
                          textAlign: 'left',
                        }}
                      >
                        <img src={cat.icon} alt={cat.label} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                        {cat.label}
                      </button>
                      {isActive && cat.subCategories.length > 0 && (
                        <div style={{ paddingLeft: 12, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {cat.subCategories.map(sub => (
                            <button
                              key={sub}
                              onClick={() => setActiveSub(sub)}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '8px 16px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.85rem',
                                fontWeight: activeSub === sub ? 600 : 400,
                                color: activeSub === sub ? 'var(--text)' : 'var(--text-muted)',
                                background: activeSub === sub ? 'var(--bg-alt)' : 'transparent',
                                transition: 'all var(--transition)',
                              }}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </aside>

            {/* Content */}
            <main className="store-content" style={{ flex: 1, minWidth: 0 }}>
              {currentCategory.subCategories.length === 0 ? (
                <ScrollReveal>
                  <div className="card" style={{ textAlign: 'center', padding: '80px 32px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 20 }}>📦</div>
                    <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1.3rem' }}>
                      {currentCategory.label} — {t('store.comingSoon')}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
                      {currentCategory.id === 'web'
                        ? t('store.webComingSoon')
                        : t('store.designComingSoon')}
                    </p>
                  </div>
                </ScrollReveal>
              ) : filtered.length === 0 ? (
                <ScrollReveal>
                  <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
                    <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{t('store.noProducts')}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {t('store.comingVerySoon')}
                    </p>
                  </div>
                </ScrollReveal>
              ) : (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={currentCategory.icon} alt={currentCategory.label} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
                      {activeSub || currentCategory.label}
                    </h2>
                  </div>
                  <div className="store-products-grid">
                    {filtered.map((product, i) => (
                      <ScrollReveal key={product.id} delay={((i % 3) + 1) as 1|2|3}>
                        <ProductCard product={product} />
                      </ScrollReveal>
                    ))}
                  </div>
                </>
              )}

              {/* ===== Recommended ===== */}
              {filtered.length > 0 && (
                <ScrollReveal style={{ marginTop: 60 }}>
                  <div style={{ marginBottom: 24 }}>
                    <h2 className="section-title" style={{ fontSize: '1.5rem' }}>{t('store.recommended')}</h2>
                  </div>
                  <div className="store-products-grid">
                    {recommended.map((product, i) => (
                      <ScrollReveal key={`rec-${product.id}`} delay={((i % 3) + 1) as 1|2|3}>
                        <ProductCard product={product} />
                      </ScrollReveal>
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {/* ===== Custom CTA ===== */}
              <ScrollReveal style={{ marginTop: 60 }}>
                <div className="store-cta-card">
                  <div className="store-cta-glow" />
                  <div style={{ position: 'relative' }}>
                    <h3 style={{ fontWeight: 800, marginBottom: 8, fontSize: '1.3rem', color: '#fff' }}>{t('store.customTitle')}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24, lineHeight: 1.7 }}>
                      {t('store.customDesc')}
                    </p>
                    <DiscordCTA title={t('store.customRequest')} variant="hero" style={{ padding: '14px 32px', fontSize: '1rem' }} />
                  </div>
                </div>
              </ScrollReveal>
            </main>
          </div>

          <style>{`
            @media (max-width: 768px) {
              .store-layout { flex-direction: column; }
              .store-sidebar {
                width: 100% !important;
                position: static !important;
                margin-bottom: 24px;
              }
            }
          `}</style>
        </div>
      </section>

      
    </div>
  )
}

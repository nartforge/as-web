import { useState, useMemo } from 'react'
import ScrollReveal from '../components/ScrollReveal'
import DiscordCTA from '../components/DiscordCTA'
import QuickView from '../components/QuickView'
import { useLanguage } from '../context/LanguageContext'
import { tReplace } from '../data/translations'
import { products, categories, type Product } from '../data/products'

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const { t } = useLanguage()

  const statusLabels: Record<string, { label: string; className: string }> = {
    'active': { label: t('product.active'), className: 'tag-success' },
    'beta': { label: t('product.beta'), className: 'tag-warning' },
    'coming-soon': { label: t('product.comingSoon'), className: 'tag-muted' },
    'development': { label: t('product.inDevelopment'), className: 'tag-warning' },
  }

  const categoryLabels: Record<string, string> = {
    'minecraft-plugin': t('products.catMinecraftPlugin'),
    'minecraft-setup': t('products.catMinecraftSetup'),
    'tasarim': t('products.catDesign'),
    'discord-bot': t('products.catDiscordBot'),
    'minecraft-addon': t('products.catMinecraftAddon'),
  }

  const qualityItems = [
    { icon: '✅', label: t('products.tested') },
    { icon: '📄', label: t('products.cleanCode') },
    { icon: '⚡', label: t('common.fastSetup') },
    { icon: '📚', label: t('products.docsIncluded') },
    { icon: '🔄', label: t('products.updateSupport') },
    { icon: '🎯', label: t('products.performanceFocused') },
  ]

  const filtered = useMemo(() => {
    let result = activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory)

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        categoryLabels[p.category].toLowerCase().includes(q)
      )
    }

    return result
  }, [activeCategory, search])

  const featuredProducts = products.filter(p => p.featured)

  return (
    <div className="page-enter" style={{ paddingTop: 'calc(var(--nav-height) + 40px)' }}>
      <section className="section" style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div className="container">

          {/* ===== Hero ===== */}
          <ScrollReveal className="text-center" style={{ marginBottom: 40 }}>
            <div className="products-hero">
              <div className="products-hero-bg" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="section-label">{t('products.heroLabel')}</span>
                <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>{t('products.title')}</h1>
                <p className="section-subtitle" style={{ maxWidth: 560, margin: '0 auto 24px' }}>
                  {t('products.subtitle')}
                </p>
                <div className="products-hero-actions">
                  <button
                    onClick={() => document.getElementById('products-list')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn btn-primary" style={{ padding: '14px 28px' }}
                  >
                    {t('products.explore')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                  <a href="https://github.com/nartforge/plugin-docs" target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '14px 24px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    {t('products.viewDocs')}
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ===== Quality Bar ===== */}
          <ScrollReveal>
            <div className="products-quality-bar">
              {qualityItems.map(item => (
                <div key={item.label} className="products-quality-item">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* ===== Featured Products ===== */}
          {featuredProducts.length > 0 && (
            <ScrollReveal style={{ marginBottom: 48 }}>
              <div className="products-featured-header">
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 4 }}>{t('products.featured')}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('products.featuredDesc')}</p>
              </div>
              <div className="products-featured-grid">
                {featuredProducts.map((product, i) => {
                  const status = statusLabels[product.status]
                  return (
                    <ScrollReveal key={product.id} delay={((i % 3) + 1) as 1|2|3}>
                      <div className="product-card product-featured-card">
                        {product.badge && (
                          <div className={`product-card-badge ${product.badge === 'popular' ? 'badge-orange' : product.badge === 'new' ? 'badge-blue' : product.badge === 'best-seller' ? 'badge-green' : 'badge-orange'}`}>
                            {product.badge === 'popular' ? t('products.popular') : product.badge === 'new' ? t('products.new') : product.badge === 'best-seller' ? t('products.bestSeller') : t('products.recommended')}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                          <div className="products-featured-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          </div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{product.name}</h3>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.88rem', marginBottom: 12 }}>{product.description}</p>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                          <span className={`tag ${status.className}`} style={{ fontSize: '0.72rem', padding: '3px 10px' }}>{status.label}</span>
                          <span className="tag tag-muted" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>{product.version || 'v1.0'}</span>
                        </div>
                        <div className="product-card-footer" style={{ paddingTop: 12 }}>
                          <span className="product-card-price" style={{ fontSize: '1rem' }}>{product.price}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product) }}
                            className="btn btn-secondary"
                            style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                          >
                            {t('products.details')}
                          </button>
                        </div>
                      </div>
                    </ScrollReveal>
                  )
                })}
              </div>
            </ScrollReveal>
          )}

          {/* ===== Search + Filters ===== */}
          <ScrollReveal>
            <div className="products-toolbar">
              <div className="products-search-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder={t('products.searchPlaceholder')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="products-search"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="products-search-clear" aria-label="Clear search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
              <div className="products-categories">
                <div className="products-categories-scroll">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={activeCategory === cat.id ? 'products-cat-btn active' : 'products-cat-btn'}
                    >
                      {cat.id === 'all' ? t('products.catAll') : categoryLabels[cat.id]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ===== Products List ===== */}
          <div id="products-list" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.length === 0 ? (
              <ScrollReveal>
                <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                  <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{t('products.notFound')}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {t('products.notFoundDesc')}
                  </p>
                </div>
              </ScrollReveal>
            ) : (
              filtered.map((product, i) => {
                const isExpanded = expanded === product.id
                const status = statusLabels[product.status]
                return (
                  <ScrollReveal key={product.id} delay={((i % 3) + 1) as 1|2|3}>
                    <div
                      className={`product-detail-card ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => setExpanded(isExpanded ? null : product.id)}
                    >
                      <div className="product-detail-header">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{product.name}</h3>
                            <span className={`tag ${status.className}`} style={{ fontSize: '0.72rem', padding: '3px 10px' }}>{status.label}</span>
                            <span className="tag tag-muted" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>{categoryLabels[product.category]}</span>
                            {product.version && (
                              <span className="tag tag-primary" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>{product.version}</span>
                            )}
                            {product.updated && (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{tReplace(t('products.updated'), { date: product.updated })}</span>
                            )}
                          </div>
                          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.92rem' }}>{product.description}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                          <span className="product-card-price" style={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }}>{product.price}</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition)' }}>
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="product-detail-body">
                          <p className="product-detail-desc">{product.longDescription}</p>

                          <div className="product-detail-section">
                            <h4 className="product-detail-section-title">{t('products.keyFeatures')}</h4>
                            <div className="product-detail-tags">
                              {product.features.map(f => (
                                <span key={f} className="product-detail-feature-tag">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                            {product.support && (
                              <span className="product-support-badge">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                {t('products.premiumSupport')}
                              </span>
                            )}
                            <span className="product-support-badge" style={{ background: 'rgba(230,81,0,0.08)', color: 'var(--primary)' }}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                              {t('products.documentation')}
                            </span>
                            {product.status !== 'coming-soon' && (
                              <DiscordCTA title={t('product.buy')} style={{ padding: '8px 20px', fontSize: '0.85rem' }} />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                )
              })
            )}
          </div>

          {/* ===== Bottom CTA ===== */}
          <ScrollReveal style={{ marginTop: 60 }}>
            <div className="products-cta">
              <div className="products-cta-glow" />
              <div style={{ position: 'relative' }}>
                <h3 style={{ fontWeight: 800, marginBottom: 8, fontSize: '1.3rem', color: '#fff' }}>{t('products.ctaTitle')}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24, lineHeight: 1.7, maxWidth: 500, margin: '0 auto 24px' }}>
                  {t('products.ctaDesc')}
                </p>
                <div className="products-hero-actions" style={{ justifyContent: 'center' }}>
                  <button
                    onClick={() => document.getElementById('products-list')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn btn-primary" style={{ padding: '14px 28px' }}
                  >
                    {t('products.viewAll')}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                  <DiscordCTA title={t('products.requestCustom')} variant="inline" style={{ padding: '14px 24px', fontSize: '0.95rem' }} />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <style>{`
            @media (max-width: 768px) {
              .product-detail-header { flex-direction: column; align-items: stretch !important; }
            }
          `}</style>
        </div>
      </section>

      {quickViewProduct && (
        <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  )
}

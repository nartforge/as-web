import { type Product } from '../data/products'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

interface Props {
  product: Product
  onQuickView?: (product: Product) => void
}

export default function ProductCard({ product, onQuickView }: Props) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const statusLabels: Record<string, { label: string; className: string }> = {
    'active': { label: t('product.active'), className: 'tag-success' },
    'beta': { label: t('product.beta'), className: 'tag-warning' },
    'coming-soon': { label: t('product.comingSoon'), className: 'tag-muted' },
    'development': { label: t('product.inDevelopment'), className: 'tag-warning' },
  }

  const badgeConfig: Record<string, { label: string; className: string }> = {
    'popular': { label: t('products.popular'), className: 'badge-orange' },
    'new': { label: t('products.new'), className: 'badge-blue' },
    'best-seller': { label: t('products.bestSeller'), className: 'badge-green' },
    'recommended': { label: t('products.recommended'), className: 'badge-orange' },
    'discount': { label: '100% OFF', className: 'badge-green' },
  }
  const status = statusLabels[product.status]
  const badge = product.badge ? badgeConfig[product.badge] : null
  const accent = product.accentColor || 'var(--primary)'
  const hasLogo = !!product.logo
  const productSlug = product.id === 'asverify' ? 'asverifydc' : product.id === 'asgiveaway' ? product.id : product.id

  return (
    <>
    <div className="product-card" onClick={() => navigate(`/store/${productSlug}`)} style={{ cursor: 'pointer' }}>
      {badge && (
        <div className={`product-card-badge ${badge.className}`}>{badge.label}</div>
      )}
      {/* Product Logo */}
      <div style={{
        width: '100%',
        aspectRatio: '1 / 1',
        maxHeight: 180,
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        margin: '-20px -20px 16px',
        padding: '24px',
        background: hasLogo
          ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 100%)'
          : 'var(--bg-alt)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {hasLogo ? (
          <img src={product.logo} alt={`${product.name} product logo`}
            style={{
              width: '100%', height: '100%',
              objectFit: 'contain', objectPosition: 'center',
              maxWidth: '100%', maxHeight: '100%',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
            }}
          />
        ) : (
          <div style={{
            width: 64, height: 64, borderRadius: 'var(--radius-md)',
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', fontWeight: 700,
            boxShadow: `0 4px 16px ${accent}33`,
          }}>
            {product.name.charAt(0)}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{product.name}</h3>
        <span className={`tag ${status.className}`}>{status.label}</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.7, fontSize: '0.9rem' }}>
        {product.description}
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {product.features.slice(0, 3).map(f => (
          <span key={f} className="tag tag-primary" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>{f}</span>
        ))}
        {product.features.length > 3 && (
          <span className="tag tag-muted" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>+{product.features.length - 3}</span>
        )}
      </div>
      <div className="product-card-footer">
        <span className="product-card-price">{product.price}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {onQuickView && (
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(product) }}
              className="btn btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              {t('product.details')}
            </button>
          )}
          {product.status === 'development' ? (
            <span className="tag tag-warning" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>{t('product.inDevelopment')}</span>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/checkout/${productSlug}`) }}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              {product.price === 'Free' ? t('product.getFree') : t('product.buy')}
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

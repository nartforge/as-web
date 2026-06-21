import { type Product } from '../data/products'
import DiscordCTA from './DiscordCTA'

interface Props {
  product: Product
  onClose: () => void
}

export default function QuickView({ product, onClose }: Props) {
  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={e => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          {product.logo ? (
            <div style={{
              width: 56, height: 56, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0,
              background: `linear-gradient(135deg, ${product.accentColor || 'var(--primary)'}20, ${product.accentColor || 'var(--primary)'}40)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src={product.logo} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          ) : (
            <div style={{
              width: 56, height: 56, borderRadius: 'var(--radius-md)', flexShrink: 0,
              background: `linear-gradient(135deg, ${product.accentColor || 'var(--primary)'}, ${product.accentColor || 'var(--primary)'}cc)`,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', fontWeight: 700,
            }}>
              {product.name.charAt(0)}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{product.name}</h2>
            <span className="tag tag-success" style={{ fontSize: '0.75rem' }}>
              {product.status === 'active' ? 'Active' : 'Beta'}
            </span>
          </div>
          <span className="product-card-price" style={{ fontSize: '1.5rem' }}>{product.price}</span>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24, fontSize: '0.95rem' }}>
          {product.longDescription}
        </p>

        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.95rem' }}>Features</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {product.features.map(f => (
              <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {product.support && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 16px', borderRadius: 'var(--radius-sm)',
            background: 'rgba(34,197,94,0.08)', color: '#22C55E',
            fontSize: '0.85rem', fontWeight: 600, marginBottom: 24,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Premium support included
          </div>
        )}

        <DiscordCTA title="Purchase on Discord" variant="hero" style={{ width: '100%', justifyContent: 'center', padding: '14px 24px' }} />
      </div>
    </div>
  )
}

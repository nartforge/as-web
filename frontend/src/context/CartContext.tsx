import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { CartItem } from '../types'

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  itemCount: number
  total: string
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [toast, setToast] = useState<string | null>(null)

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      if (prev.some(i => i.productId === item.productId)) return prev
      return [...prev, { ...item, quantity: 1 }]
    })
    setToast(`${item.name} added to cart!`)
    setTimeout(() => setToast(null), 2500)
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = items.length

  const total = items.length === 0
    ? '€0.00'
    : items.map(i => {
        const num = parseFloat(i.price.replace(/[€$]/g, ''))
        return isNaN(num) ? 0 : num * i.quantity
      }).reduce((a, b) => a + b, 0).toFixed(2)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, itemCount, total }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: '#22C55E', color: '#fff', padding: '12px 20px',
          borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '0.9rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          animation: 'slideUp 0.3s ease',
        }}>
          {toast}
        </div>
      )}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

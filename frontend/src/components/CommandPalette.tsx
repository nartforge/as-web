import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { products } from '../data/products'
import { wikiArticles } from '../data/wiki'

interface SearchItem {
  name: string
  path: string
  category: 'Page' | 'Product' | 'Wiki'
}

const pageItems: SearchItem[] = [
  { name: 'Home', path: '/', category: 'Page' },
  { name: 'Store', path: '/magaza', category: 'Page' },
  { name: 'Products', path: '/urunler', category: 'Page' },
  { name: 'Wiki', path: '/wiki', category: 'Page' },
  { name: 'Support', path: '/destek', category: 'Page' },
  { name: 'Development', path: '/gelistirme', category: 'Page' },
  { name: 'Dashboard', path: '/dashboard', category: 'Page' },
  { name: 'Login', path: '/login', category: 'Page' },
]

const productItems: SearchItem[] = products.map(p => ({
  name: p.name,
  path: '/urunler',
  category: 'Product' as const,
}))

const wikiItems: SearchItem[] = wikiArticles.map(a => ({
  name: a.title,
  path: '/wiki',
  category: 'Wiki' as const,
}))

const allItems: SearchItem[] = [...pageItems, ...productItems, ...wikiItems]

const categoryColors: Record<string, string> = {
  Page: '#FF6D00',
  Product: '#22C55E',
  Wiki: '#3B82F6',
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.trim()
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
    : allItems

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setOpen(prev => !prev)
    }
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    } else {
      setQuery('')
    }
  }, [open])

  const select = (item: SearchItem) => {
    navigate(item.path)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => (i + 1) % filtered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => (i - 1 + filtered.length) % filtered.length)
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      select(filtered[selectedIndex])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '12vh',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 580,
              background: 'rgba(18,20,26,0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search pages, products, wiki..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '1.1rem',
                  padding: '8px 0',
                }}
              />
            </div>

            <div style={{ maxHeight: 360, overflowY: 'auto', padding: '6px 0' }}>
              {filtered.length === 0 && (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted, #888)', fontSize: '0.9rem' }}>
                  No results found for &ldquo;{query}&rdquo;
                </div>
              )}

              {filtered.map((item, i) => (
                <div
                  key={`${item.category}-${item.name}`}
                  onClick={() => select(item)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 16px',
                    cursor: 'pointer',
                    background: i === selectedIndex ? 'rgba(255,109,0,0.15)' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: categoryColors[item.category],
                      color: '#fff',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.category}
                  </span>
                  <span style={{ color: '#fff', fontSize: '0.95rem' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface WidgetData {
  presence_count: number
}

export default function DiscordStatus() {
  const [online, setOnline] = useState(false)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const abort = new AbortController()
    fetch('https://discord.com/api/guilds/1000368473696575508/widget.json', { signal: abort.signal })
      .then(res => res.json())
      .then((data: WidgetData) => {
        setOnline(true)
        setCount(data.presence_count)
        setLoading(false)
      })
      .catch(() => {
        setOnline(false)
        setCount(0)
        setLoading(false)
      })
    return () => abort.abort()
  }, [])

  const dot = (
    <motion.span
      animate={online ? { opacity: [1, 0.4, 1] } : undefined}
      transition={online ? { duration: 2, repeat: Infinity } : undefined}
      style={{
        width: 8, height: 8, borderRadius: '50%',
        background: online ? '#22C55E' : '#EF4444',
        display: 'inline-block',
      }}
    />
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
      {dot}
      <span>{loading ? 'Loading...' : `${count} Online`}</span>
    </div>
  )
}

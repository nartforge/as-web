import { useEffect, useState } from 'react'
import { useMotionValue, useSpring, motion } from 'framer-motion'

export default function CursorGlow() {
  const [visible, setVisible] = useState(false)

  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30, mass: 0.5 })

  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover)').matches
    if (!hasHover) return
    setVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 150)
      mouseY.set(e.clientY - 150)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  if (!visible) return null

  return (
    <motion.div
      style={{
        position: 'fixed',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 109, 0, 0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 9999,
        x: springX,
        y: springY,
      }}
    />
  )
}

import { useRef, useState, type ReactNode, type CSSProperties } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  maxTilt?: number
  glare?: boolean
}

export default function TiltCard({ children, className, style, maxTilt = 10, glare = false }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const rx = (-dy / (rect.height / 2)) * maxTilt
    const ry = (dx / (rect.width / 2)) * maxTilt
    setTilt({ rx, ry })
    if (glare) {
      const px = ((e.clientX - rect.left) / rect.width) * 100
      const py = ((e.clientY - rect.top) / rect.height) * 100
      setGlarePos({ x: 100 - px, y: 100 - py })
    }
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0 })
    setGlarePos({ x: 50, y: 50 })
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s ease',
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        position: 'relative',
        ...style,
      }}
    >
      {children}
      {glare && (
        <div
          style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
            transition: 'background 0.5s ease',
          }}
        />
      )}
    </div>
  )
}

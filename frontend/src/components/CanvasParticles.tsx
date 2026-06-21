import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  speedX: number
  speedY: number
  char: string
  size: number
  opacity: number
}

const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/\\|!@#$%^&*()'

function randomChar(): string {
  return chars[Math.floor(Math.random() * chars.length)]
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: -(0.3 + Math.random() * 0.4),
    char: randomChar(),
    size: 8 + Math.random() * 14,
    opacity: 0.1 + Math.random() * 0.5,
  }
}

export default function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    const particles: Particle[] = []
    const particleCount = 80

    function resize() {
      if (!canvas) return
      w = canvas.width = canvas.parentElement?.offsetWidth ?? window.innerWidth
      h = canvas.height = canvas.parentElement?.offsetHeight ?? window.innerHeight
    }

    resize()
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(w, h))
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        ctx.fillStyle = `rgba(255, 183, 77, ${p.opacity * 0.15})`
        ctx.font = `${p.size}px monospace`
        ctx.fillText(p.char, p.x, p.y)

        p.x += p.speedX
        p.y += p.speedY

        if (p.y < -20) {
          p.y = h + 20
          p.x = Math.random() * w
          p.char = randomChar()
        }
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

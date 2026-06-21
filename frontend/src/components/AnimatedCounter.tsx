import { useEffect, useRef } from 'react'

interface Props {
  target: number
  suffix?: string
  duration?: number
  delay?: number
}

export default function AnimatedCounter({ target, suffix = '', duration = 2000, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        setTimeout(() => {
          const startTime = performance.now()
          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            el!.textContent = `${Math.floor(eased * target)}${suffix}`
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }, delay)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix, duration, delay])

  return <div ref={ref} className="counter-number">0{suffix}</div>
}

import { useState } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  width?: string | number
  height?: string | number
}

export default function LazyImage({ src, alt, className, style, width = '100%', height = '100%' }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={className}
      style={{ position: 'relative', overflow: 'hidden', width, height, ...style }}
    >
      {!loaded && (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
            backgroundSize: '200% 100%',
            animation: 'lazy-shimmer 1.5s infinite',
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
          width: '100%', height: '100%', objectFit: 'cover',
        }}
      />
      <style>{`
        @keyframes lazy-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

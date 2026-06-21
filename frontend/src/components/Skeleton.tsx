import React from 'react'

interface Props {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  variant?: 'text' | 'card' | 'circle'
}

const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.5s infinite',
}

export default function Skeleton({ width = '100%', height = '20px', borderRadius = '8px', variant = 'text' }: Props) {
  if (variant === 'circle') {
    return (
      <div
        style={{
          ...shimmerStyle,
          width,
          height: width,
          borderRadius: '50%',
        }}
      />
    )
  }

  if (variant === 'card') {
    return (
      <div
        style={{
          ...shimmerStyle,
          width: '100%',
          height,
          borderRadius,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            ...shimmerStyle,
            width: '100%',
            height: 160,
            borderRadius: 12,
          }}
        />
        <div
          style={{
            ...shimmerStyle,
            width: '70%',
            height: 20,
            borderRadius: 6,
          }}
        />
        <div
          style={{
            ...shimmerStyle,
            width: '100%',
            height: 14,
            borderRadius: 6,
          }}
        />
        <div
          style={{
            ...shimmerStyle,
            width: '80%',
            height: 14,
            borderRadius: 6,
          }}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        ...shimmerStyle,
        width,
        height,
        borderRadius,
      }}
    />
  )
}

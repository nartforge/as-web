interface Props {
  position?: 'top' | 'bottom'
  flip?: boolean
}

export default function WaveDivider({ position = 'bottom', flip }: Props) {
  return (
    <div className={`wave-divider ${position}`} style={{ transform: flip ? 'scaleY(-1)' : 'none' }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6D00" stopOpacity="0.04" />
            <stop offset="50%" stopColor="#FF8A65" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FF6D00" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <path
          fill="url(#waveGrad)"
          d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  )
}

import { type ReactNode, type CSSProperties } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: delay * 0.15,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
}

export default function ScrollReveal({ children, delay = 0, className = '', style }: Props) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      custom={delay}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

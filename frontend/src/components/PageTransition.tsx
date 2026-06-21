import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: ReactNode
  location: string
}

export default function PageTransition({ children, location }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

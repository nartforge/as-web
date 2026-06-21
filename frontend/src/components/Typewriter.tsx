import { useState, useEffect } from 'react'

interface Props {
  words: string[]
  className?: string
}

export default function Typewriter({ words, className }: Props) {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex(c => c + 1), 80)
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(c => c - 1), 40)
    } else if (deleting && charIndex === 0) {
      setDeleting(false)
      setWordIndex(i => (i + 1) % words.length)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, deleting, wordIndex, words])

  return (
    <span className={className}>
      {words[wordIndex].substring(0, charIndex)}
      <span className="typewriter-cursor" />
    </span>
  )
}

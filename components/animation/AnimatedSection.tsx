import { useEffect, useState } from 'react'
import './AnimationCss.scss'

interface Props {
  show: boolean
  children: React.ReactNode
}

export const AnimatedSection = ({ show, children }: Props) => {
  const [render, setRender] = useState(show)
  const [animation, setAnimation] = useState('')

  useEffect(() => {
    if (show) {
      setRender(true)
      setAnimation('animate-collapseIn')
    } else {
      setAnimation('animate-collapseOut')
      const timeout = setTimeout(() => {
        setRender(false)
      }, 200)
      return () => clearTimeout(timeout)
    }
  }, [show])

  if (!render) return null

  return (
    <div className={`${animation} relative`}>
      {children}
    </div>
  )
}

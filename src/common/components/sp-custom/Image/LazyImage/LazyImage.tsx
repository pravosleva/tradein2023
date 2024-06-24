/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState, memo } from 'react'

const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL
const PUBLIC_URL = VITE_PUBLIC_URL || ''

export const LazyImage = memo(({ src, ...restProps }: React.HTMLProps<HTMLImageElement>) => {
  const [inView, setInView] = useState(false)

  const placeholderRef = useRef(null)

  const onIntersection: IntersectionObserverCallback = (entries, _opts) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setInView(true)
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection, {
      root: null, // default is the viewport
      threshold: 0.5, // percentage of target's visible area. Triggers "onIntersection"
    })

    if (placeholderRef?.current) {
      observer.observe(placeholderRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return inView ? (
    <img
      src={src}
      {...restProps}
      alt={restProps.alt || ''}

      // loading='lazy'
      // @ts-ignore
      // fetchpriority='low'
      // decoding='async'
    />
  ) : (
    <img
      {...restProps}
      ref={placeholderRef}
      src={`${PUBLIC_URL}/static3/img/loaders/loader7-spBlueMain.svg`}
      alt={restProps.alt || ''}
      // style={{
      //   ...(restProps.style || {}),
      //   backgroundColor: '',
      // }}
      // loading='lazy'
    />
  )
})

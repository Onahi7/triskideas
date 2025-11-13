"use client"

import { useInView } from "react-intersection-observer"
import type { ReactNode } from "react"

export default function AnimatedSection({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <div
      ref={ref}
      style={{
        animation: inView ? `fadeInUp 0.8s ease-out ${delay}s both` : "none",
      }}
    >
      {children}
    </div>
  )
}

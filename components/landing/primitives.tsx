"use client"

/**
 * Shared landing-page primitives.
 *
 * These live outside app/page.tsx so the individual showcase sections
 * (ai-showcase, capability-grid) can reuse the exact same entrance timing
 * and tilt physics as the hero and bento grid.
 */

import { useRef } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"

// ─── Fade-in on scroll ──────────────────────────────────────────────────────────
export function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >{children}</motion.div>
  )
}

// ─── 3-D tilt card wrapper ──────────────────────────────────────────────────────
export function TiltCard({ children, className = "" }: {
  children: React.ReactNode; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useTransform(y, [-0.5, 0.5], [7, -7])
  const ry = useTransform(x, [-0.5, 0.5], [-7, 7])
  const sx = useSpring(rx, { stiffness: 300, damping: 30 })
  const sy = useSpring(ry, { stiffness: 300, damping: 30 })

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: sx, rotateY: sy, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`h-full ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ─── Ambient floating orb ───────────────────────────────────────────────────────
export function Orb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.45, 0.25] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

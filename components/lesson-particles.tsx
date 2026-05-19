"use client"

import { useEffect, useRef } from "react"

const COUNT  = 42
const MAX_V  = 0.45
const R_DIST = 140   // mouse repulsion radius
const R_FORCE = 0.55

interface P {
  x: number; y: number
  vx: number; vy: number
  r: number        // core radius
  phase: number    // opacity oscillation
  pspd: number     // phase speed
}

function hexRgb(hex: string): [number, number, number] {
  const m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [139, 92, 246]
}

export function LessonParticles({ color, active }: { color: string; active: boolean }) {
  const cvs    = useRef<HTMLCanvasElement>(null)
  const raf    = useRef(0)
  const mouse  = useRef({ x: -9999, y: -9999 })
  const pts    = useRef<P[]>([])
  const cur    = useRef<[number, number, number]>(hexRgb(color))
  const tgt    = useRef<[number, number, number]>(hexRgb(color))

  // Track theme colour changes
  useEffect(() => { tgt.current = hexRgb(color) }, [color])

  useEffect(() => {
    if (!active) { pts.current = []; return }

    const c   = cvs.current!
    const ctx = c.getContext("2d")!

    const resize = () => {
      c.width  = window.innerWidth
      c.height = window.innerHeight
      // Spawn particles only on first mount
      if (!pts.current.length) {
        pts.current = Array.from({ length: COUNT }, () => ({
          x:     Math.random() * c.width,
          y:     Math.random() * c.height,
          vx:    (Math.random() - 0.5) * MAX_V,
          vy:    (Math.random() - 0.5) * MAX_V,
          r:     Math.random() * 2 + 1,
          phase: Math.random() * Math.PI * 2,
          pspd:  Math.random() * 0.009 + 0.003,
        }))
      }
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", (e) => { mouse.current = { x: e.clientX, y: e.clientY } })
    document.addEventListener("mouseleave", () => { mouse.current = { x: -9999, y: -9999 } })

    const tick = () => {
      raf.current = requestAnimationFrame(tick)

      // Slowly interpolate colour toward target
      const [cr, cg, cb] = cur.current
      const [tr, tg, tb] = tgt.current
      cur.current[0] = cr + (tr - cr) * 0.04
      cur.current[1] = cg + (tg - cg) * 0.04
      cur.current[2] = cb + (tb - cb) * 0.04
      const r = Math.round(cur.current[0])
      const g = Math.round(cur.current[1])
      const b = Math.round(cur.current[2])

      ctx.clearRect(0, 0, c.width, c.height)

      for (const p of pts.current) {
        // Mouse repulsion
        const dx = p.x - mouse.current.x
        const dy = p.y - mouse.current.y
        const d2 = dx * dx + dy * dy
        if (d2 < R_DIST * R_DIST && d2 > 0.1) {
          const d = Math.sqrt(d2)
          const f = (1 - d / R_DIST) * R_FORCE
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }

        // Dampen and clamp speed
        p.vx *= 0.97
        p.vy *= 0.97
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > MAX_V * 4) { p.vx = (p.vx / spd) * MAX_V * 4; p.vy = (p.vy / spd) * MAX_V * 4 }

        p.x += p.vx
        p.y += p.vy
        p.phase += p.pspd

        // Wrap at edges
        if (p.x < -12)           p.x = c.width  + 12
        if (p.x > c.width  + 12) p.x = -12
        if (p.y < -12)           p.y = c.height + 12
        if (p.y > c.height + 12) p.y = -12

        const alpha = 0.14 + Math.sin(p.phase) * 0.07  // 0.07–0.21

        // Soft outer glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${(alpha * 0.18).toFixed(3)})`
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
        ctx.fill()
      }
    }

    raf.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener("resize", resize)
      pts.current = []
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={cvs}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden
    />
  )
}

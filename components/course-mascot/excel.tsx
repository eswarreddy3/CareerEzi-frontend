"use client"

import { motion, AnimatePresence } from "framer-motion"

interface Props { stage: 0 | 1 | 2 | 3 | 4 }

export function ExcelMascot({ stage }: Props) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.g key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Buried under papers — only feet sticking out */}
            <motion.g animate={{ y: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
              {/* Paper pile */}
              {[
                { x: 14, y: 22, w: 52, h: 10, r: 3, fill: "#f9fafb", rot: -5 },
                { x: 12, y: 28, w: 56, h: 10, r: 3, fill: "#f3f4f6", rot: 3 },
                { x: 10, y: 34, w: 60, h: 10, r: 3, fill: "#e5e7eb", rot: -2 },
                { x: 8,  y: 40, w: 64, h: 10, r: 3, fill: "#d1d5db", rot: 4 },
                { x: 6,  y: 46, w: 68, h: 12, r: 3, fill: "#9ca3af", rot: -3 },
              ].map((p, i) => (
                <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={p.r} fill={p.fill}
                  transform={`rotate(${p.rot} 40 45)`} />
              ))}
              {/* Lines on papers */}
              <line x1={20} y1={45} x2={50} y2={45} stroke="#9ca3af" strokeWidth={1} />
              <line x1={20} y1={49} x2={45} y2={49} stroke="#9ca3af" strokeWidth={1} />
              {/* Feet sticking out */}
              <ellipse cx={32} cy={62} rx={6} ry={4} fill="#fbbf24" />
              <ellipse cx={48} cy={62} rx={6} ry={4} fill="#fbbf24" />
              {/* Legs */}
              <rect x={29} y={56} width={6} height={8} rx={3} fill="#92400e" />
              <rect x={45} y={56} width={6} height={8} rx={3} fill="#92400e" />
            </motion.g>
          </motion.g>
        )}

        {stage === 1 && (
          <motion.g key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Sitting, papers organized in stacks */}
            <motion.g animate={{ y: [0, -1, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              {/* Sitting wizard body */}
              <ellipse cx={40} cy={56} rx={18} ry={12} fill="#4b5563" />
              {/* Head */}
              <circle cx={40} cy={36} r={12} fill="#fcd34d" />
              {/* Simple glasses */}
              <circle cx={36} cy={36} r={4} stroke="#374151" strokeWidth={1.5} fill="none" />
              <circle cx={44} cy={36} r={4} stroke="#374151" strokeWidth={1.5} fill="none" />
              <line x1={40} y1={36} x2={40} y2={36} stroke="#374151" strokeWidth={1.5} />
              <line x1={32} y1={36} x2={30} y2={35} stroke="#374151" strokeWidth={1.5} />
              <line x1={48} y1={36} x2={50} y2={35} stroke="#374151" strokeWidth={1.5} />
              {/* Organized paper stacks beside */}
              {[16, 56].map((x, i) => (
                <g key={i}>
                  <rect x={x} y={50} width={12} height={2} rx={1} fill="#e5e7eb" />
                  <rect x={x} y={53} width={12} height={2} rx={1} fill="#d1d5db" />
                  <rect x={x} y={56} width={12} height={2} rx={1} fill="#9ca3af" />
                </g>
              ))}
            </motion.g>
          </motion.g>
        )}

        {stage === 2 && (
          <motion.g key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Standing, floating chart beside */}
            <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              {/* Body */}
              <rect x={28} y={38} width={24} height={28} rx={6} fill="#4b5563" />
              {/* Head */}
              <circle cx={40} cy={30} r={12} fill="#fcd34d" />
              {/* Glasses */}
              <circle cx={36} cy={30} r={4} stroke="#374151" strokeWidth={1.5} fill="none" />
              <circle cx={44} cy={30} r={4} stroke="#374151" strokeWidth={1.5} fill="none" />
              <line x1={40} y1={30} x2={40} y2={30} stroke="#374151" strokeWidth={1.5} />
              <line x1={32} y1={30} x2={30} y2={29} stroke="#374151" strokeWidth={1.5} />
              <line x1={48} y1={30} x2={50} y2={29} stroke="#374151" strokeWidth={1.5} />
              {/* Arms */}
              <rect x={16} y={42} width={12} height={7} rx={3} fill="#4b5563" />
              <rect x={52} y={42} width={12} height={7} rx={3} fill="#4b5563" />
              {/* Legs */}
              <rect x={30} y={64} width={8} height={12} rx={3} fill="#374151" />
              <rect x={42} y={64} width={8} height={12} rx={3} fill="#374151" />
            </motion.g>
            {/* Floating chart */}
            <motion.g animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
              <rect x={54} y={20} width={20} height={16} rx={3} fill="#1e293b" stroke="#10b981" strokeWidth={1} />
              {/* Bar chart inside */}
              <rect x={57} y={28} width={3} height={5} fill="#10b981" opacity={0.8} />
              <rect x={62} y={25} width={3} height={8} fill="#10b981" />
              <rect x={67} y={22} width={3} height={11} fill="#10b981" />
              <line x1={56} y1={33} x2={72} y2={33} stroke="#10b981" strokeWidth={0.5} opacity={0.5} />
            </motion.g>
          </motion.g>
        )}

        {stage === 3 && (
          <motion.g key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Wizard hat + orbiting charts */}
            <motion.g animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
              {/* Body */}
              <rect x={28} y={38} width={24} height={26} rx={6} fill="#374151" />
              {/* Robe stars */}
              {[[34, 45], [42, 50], [36, 57]].map(([sx, sy], i) => (
                <text key={i} x={sx} y={sy} fontSize={6} fill="#fbbf24" opacity={0.6}>★</text>
              ))}
              {/* Head */}
              <circle cx={40} cy={30} r={12} fill="#fcd34d" />
              {/* Wizard hat */}
              <path d="M40 8 L31 24 L49 24 Z" fill="#7c3aed" />
              <rect x={29} y={22} width={22} height={4} rx={2} fill="#6d28d9" />
              {/* Hat star */}
              <text x={37} y={19} fontSize={7} fill="#fbbf24">★</text>
              {/* Glasses */}
              <circle cx={36} cy={30} r={4} stroke="#374151" strokeWidth={1.5} fill="none" />
              <circle cx={44} cy={30} r={4} stroke="#374151" strokeWidth={1.5} fill="none" />
              <line x1={32} y1={30} x2={30} y2={29} stroke="#374151" strokeWidth={1.5} />
              <line x1={48} y1={30} x2={50} y2={29} stroke="#374151" strokeWidth={1.5} />
              {/* Staff */}
              <line x1={56} y1={44} x2={60} y2={72} stroke="#92400e" strokeWidth={3} strokeLinecap="round" />
              <motion.circle cx={56} cy={43} r={5} fill="#fbbf24" opacity={0.8}
                animate={{ r: [5, 6.5, 5] }} transition={{ repeat: Infinity, duration: 1 }} />
              {/* Arms */}
              <rect x={16} y={42} width={12} height={7} rx={3} fill="#374151" />
              <rect x={52} y={42} width={12} height={7} rx={3} fill="#374151" />
              {/* Legs */}
              <rect x={30} y={62} width={8} height={14} rx={3} fill="#1f2937" />
              <rect x={42} y={62} width={8} height={14} rx={3} fill="#1f2937" />
            </motion.g>
            {/* Orbiting charts */}
            {[0, 180].map((deg, i) => (
              <motion.g key={i}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                style={{ transformOrigin: "40px 44px" }}
              >
                <rect
                  x={40 + 26 * Math.cos((deg * Math.PI) / 180) - 6}
                  y={44 + 26 * Math.sin((deg * Math.PI) / 180) - 5}
                  width={12} height={10} rx={2} fill="#1e293b" stroke="#10b981" strokeWidth={1}
                />
              </motion.g>
            ))}
          </motion.g>
        )}

        {stage === 4 && (
          <motion.g key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Full wizard: glowing staff + rune symbols */}
            <motion.g animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
              {/* Aura */}
              <motion.circle cx={40} cy={44} r={32} fill="#fbbf24" opacity={0.06}
                animate={{ r: [32, 36, 32] }} transition={{ repeat: Infinity, duration: 2 }} />
              {/* Body */}
              <rect x={27} y={38} width={26} height={26} rx={6} fill="#1f2937" stroke="#fbbf24" strokeWidth={1} />
              {/* Robe glam */}
              {[[33, 46], [43, 52], [35, 58]].map(([sx, sy], i) => (
                <motion.text key={i} x={sx} y={sy} fontSize={7} fill="#fbbf24"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4 }}
                >✦</motion.text>
              ))}
              {/* Head */}
              <circle cx={40} cy={28} r={12} fill="#fcd34d" />
              {/* Wizard hat */}
              <path d="M40 5 L30 23 L50 23 Z" fill="#7c3aed" stroke="#a78bfa" strokeWidth={1} />
              <rect x={28} y={21} width={24} height={5} rx={2} fill="#6d28d9" stroke="#a78bfa" strokeWidth={0.5} />
              <motion.text x={37} y={18} fontSize={7} fill="#fde68a"
                animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 0.9 }}>★</motion.text>
              {/* Glasses */}
              <circle cx={36} cy={28} r={4} stroke="#374151" strokeWidth={1.5} fill="none" />
              <circle cx={44} cy={28} r={4} stroke="#374151" strokeWidth={1.5} fill="none" />
              <line x1={32} y1={28} x2={30} y2={27} stroke="#374151" strokeWidth={1.5} />
              <line x1={48} y1={28} x2={50} y2={27} stroke="#374151" strokeWidth={1.5} />
              {/* Glowing staff */}
              <line x1={57} y1={40} x2={62} y2={72} stroke="#92400e" strokeWidth={3.5} strokeLinecap="round" />
              <motion.circle cx={57} cy={39} r={7} fill="#fbbf24"
                animate={{ r: [7, 9, 7] }} transition={{ repeat: Infinity, duration: 0.8 }} />
              <motion.circle cx={57} cy={39} r={4} fill="#fde68a"
                animate={{ r: [4, 5.5, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} />
              {/* Arms */}
              <rect x={15} y={41} width={12} height={7} rx={3} fill="#1f2937" stroke="#fbbf24" strokeWidth={0.8} />
              <rect x={53} y={41} width={12} height={7} rx={3} fill="#1f2937" stroke="#fbbf24" strokeWidth={0.8} />
              {/* Legs */}
              <rect x={29} y={62} width={9} height={14} rx={3} fill="#111827" stroke="#fbbf24" strokeWidth={0.8} />
              <rect x={42} y={62} width={9} height={14} rx={3} fill="#111827" stroke="#fbbf24" strokeWidth={0.8} />
            </motion.g>
            {/* Rune orbits */}
            {["∑", "π", "∞", "Ω"].map((rune, i) => (
              <motion.g key={i}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                style={{ transformOrigin: "40px 44px" }}
              >
                <motion.text
                  x={40 + 28 * Math.cos((i * 90 * Math.PI) / 180) - 4}
                  y={44 + 28 * Math.sin((i * 90 * Math.PI) / 180) + 4}
                  fontSize={8} fill="#fbbf24"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
                >{rune}</motion.text>
              </motion.g>
            ))}
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

"use client"

import { motion, AnimatePresence } from "framer-motion"

interface Props { stage: 0 | 1 | 2 | 3 | 4 }

export function DsaMascot({ stage }: Props) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.g key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Locked pod with robot parts inside */}
            <motion.g animate={{ y: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              {/* Pod */}
              <rect x={16} y={12} width={48} height={56} rx={10} fill="#1e293b" stroke="#334155" strokeWidth={2} />
              {/* Lock */}
              <rect x={33} y={52} width={14} height={10} rx={3} fill="#475569" />
              <path d="M35 52 Q35 46 40 46 Q45 46 45 52" stroke="#475569" strokeWidth={2.5} fill="none" />
              <circle cx={40} cy={57} r={2} fill="#334155" />
              {/* Robot parts inside — scattered */}
              <rect x={27} y={20} width={10} height={8} rx={2} fill="#334155" opacity={0.8} />
              <circle cx={50} cy={26} r={5} fill="#334155" opacity={0.8} />
              <rect x={24} y={36} width={8} height={6} rx={2} fill="#334155" opacity={0.8} />
              <rect x={46} y={36} width={8} height={6} rx={2} fill="#334155" opacity={0.8} />
              {/* Dim X eyes on head part */}
              <text x={29} y={27} fontSize={6} fill="#1e293b">✕</text>
              <text x={35} y={27} fontSize={6} fill="#1e293b">✕</text>
            </motion.g>
          </motion.g>
        )}

        {stage === 1 && (
          <motion.g key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Cracked pod, parts assembling */}
            <motion.g animate={{ y: [0, -1, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
              {/* Pod with crack */}
              <rect x={16} y={12} width={48} height={56} rx={10} fill="#1e293b" stroke="#334155" strokeWidth={2} />
              <motion.path d="M40 12 L37 25 L42 35 L38 50 L40 68"
                stroke="#60a5fa" strokeWidth={1.5} fill="none" strokeLinecap="round"
                animate={{ pathLength: [0, 1] }} transition={{ duration: 1.5 }} />
              {/* Assembling robot */}
              <motion.rect x={28} y={18} width={24} height={18} rx={4} fill="#334155"
                animate={{ y: [18, 16, 18] }} transition={{ repeat: Infinity, duration: 1.5 }} />
              <motion.rect x={26} y={40} width={28} height={18} rx={4} fill="#334155"
                animate={{ y: [40, 38, 40] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} />
              {/* One lit eye */}
              <motion.circle cx={36} cy={28} r={3} fill="#60a5fa"
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} />
              <circle cx={44} cy={28} r={3} fill="#1e293b" />
            </motion.g>
          </motion.g>
        )}

        {stage === 2 && (
          <motion.g key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Basic assembled boxy robot */}
            <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              {/* Head */}
              <rect x={26} y={10} width={28} height={22} rx={5} fill="#334155" />
              {/* Antenna */}
              <line x1={40} y1={10} x2={40} y2={5} stroke="#64748b" strokeWidth={2} strokeLinecap="round" />
              <circle cx={40} cy={4} r={2.5} fill="#60a5fa" />
              {/* Dim eyes */}
              <circle cx={35} cy={21} r={3.5} fill="#1e40af" />
              <circle cx={45} cy={21} r={3.5} fill="#1e40af" />
              {/* Body */}
              <rect x={24} y={34} width={32} height={24} rx={5} fill="#334155" />
              {/* Panel */}
              <rect x={29} y={38} width={22} height={14} rx={3} fill="#1e293b" />
              {/* Arms */}
              <rect x={12} y={36} width={12} height={8} rx={4} fill="#334155" />
              <rect x={56} y={36} width={12} height={8} rx={4} fill="#334155" />
              {/* Legs */}
              <rect x={27} y={57} width={10} height={14} rx={4} fill="#1e293b" />
              <rect x={43} y={57} width={10} height={14} rx={4} fill="#1e293b" />
            </motion.g>
          </motion.g>
        )}

        {stage === 3 && (
          <motion.g key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Glowing blue core robot */}
            <motion.g animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
              {/* Head */}
              <rect x={26} y={10} width={28} height={22} rx={5} fill="#1e293b" stroke="#60a5fa" strokeWidth={1.5} />
              {/* Antenna with glow */}
              <line x1={40} y1={10} x2={40} y2={4} stroke="#60a5fa" strokeWidth={2} />
              <motion.circle cx={40} cy={3} r={3} fill="#60a5fa"
                animate={{ r: [3, 4, 3] }} transition={{ repeat: Infinity, duration: 0.8 }} />
              {/* Glowing eyes */}
              <motion.circle cx={35} cy={21} r={4} fill="#60a5fa"
                animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 0.9 }} />
              <motion.circle cx={45} cy={21} r={4} fill="#60a5fa"
                animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.15 }} />
              {/* Body with core */}
              <rect x={24} y={34} width={32} height={24} rx={5} fill="#1e293b" stroke="#60a5fa" strokeWidth={1.5} />
              <motion.rect x={30} y={39} width={20} height={12} rx={3} fill="#60a5fa" opacity={0.2}
                animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ repeat: Infinity, duration: 1.2 }} />
              {/* Arms */}
              <rect x={12} y={36} width={12} height={8} rx={4} fill="#1e293b" stroke="#60a5fa" strokeWidth={1} />
              <rect x={56} y={36} width={12} height={8} rx={4} fill="#1e293b" stroke="#60a5fa" strokeWidth={1} />
              {/* Legs */}
              <rect x={27} y={57} width={10} height={14} rx={4} fill="#1e293b" stroke="#60a5fa" strokeWidth={1} />
              <rect x={43} y={57} width={10} height={14} rx={4} fill="#1e293b" stroke="#60a5fa" strokeWidth={1} />
            </motion.g>
          </motion.g>
        )}

        {stage === 4 && (
          <motion.g key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Full mech with jet exhausts */}
            <motion.g animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
              {/* Jet exhausts */}
              {[27, 43].map((x, i) => (
                <g key={i}>
                  <motion.ellipse cx={x + 5} cy={73} rx={3.5} ry={5}
                    fill="#60a5fa" opacity={0.4}
                    animate={{ ry: [5, 8, 5], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.1 }} />
                  <motion.ellipse cx={x + 5} cy={74} rx={2} ry={3}
                    fill="#bfdbfe" opacity={0.7}
                    animate={{ ry: [3, 5, 3] }}
                    transition={{ repeat: Infinity, duration: 0.3 }} />
                </g>
              ))}
              {/* Head */}
              <rect x={26} y={8} width={28} height={22} rx={5} fill="#0f172a" stroke="#7dd3fc" strokeWidth={2} />
              {/* Antenna */}
              <line x1={40} y1={8} x2={40} y2={2} stroke="#7dd3fc" strokeWidth={2} />
              <motion.circle cx={40} cy={1} r={3.5} fill="#7dd3fc"
                animate={{ r: [3.5, 5, 3.5] }} transition={{ repeat: Infinity, duration: 0.7 }} />
              {/* Eyes */}
              <motion.circle cx={35} cy={19} r={4.5} fill="#7dd3fc"
                animate={{ r: [4.5, 5.5, 4.5] }} transition={{ repeat: Infinity, duration: 0.7 }} />
              <motion.circle cx={45} cy={19} r={4.5} fill="#7dd3fc"
                animate={{ r: [4.5, 5.5, 4.5] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }} />
              {/* Body */}
              <rect x={22} y={32} width={36} height={26} rx={6} fill="#0f172a" stroke="#7dd3fc" strokeWidth={2} />
              <motion.rect x={28} y={37} width={24} height={14} rx={4} fill="#7dd3fc" opacity={0.2}
                animate={{ opacity: [0.15, 0.4, 0.15] }} transition={{ repeat: Infinity, duration: 0.8 }} />
              {/* Arms with cannons */}
              <rect x={10} y={34} width={12} height={10} rx={4} fill="#0f172a" stroke="#7dd3fc" strokeWidth={1.5} />
              <rect x={58} y={34} width={12} height={10} rx={4} fill="#0f172a" stroke="#7dd3fc" strokeWidth={1.5} />
              <rect x={8} y={37} width={4} height={4} rx={2} fill="#7dd3fc" />
              <rect x={68} y={37} width={4} height={4} rx={2} fill="#7dd3fc" />
              {/* Legs */}
              <rect x={27} y={57} width={10} height={16} rx={4} fill="#0f172a" stroke="#7dd3fc" strokeWidth={1.5} />
              <rect x={43} y={57} width={10} height={16} rx={4} fill="#0f172a" stroke="#7dd3fc" strokeWidth={1.5} />
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

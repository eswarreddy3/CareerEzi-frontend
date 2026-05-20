"use client"

import { motion, AnimatePresence } from "framer-motion"

interface Props { stage: 0 | 1 | 2 | 3 | 4 }

export function SqlMascot({ stage }: Props) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.g key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Chained stone golem — slumped */}
            <motion.g animate={{ y: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              {/* Body */}
              <rect x={25} y={30} width={30} height={32} rx={6} fill="#4b5563" />
              {/* Head */}
              <rect x={28} y={18} width={24} height={20} rx={5} fill="#6b7280" />
              {/* X eyes */}
              <text x={33} y={32} fontSize={7} fill="#374151" fontWeight="bold">✕</text>
              <text x={42} y={32} fontSize={7} fill="#374151" fontWeight="bold">✕</text>
              {/* Chains */}
              {[38, 48].map((cx, i) => (
                <g key={i}>
                  <circle cx={cx} cy={65} r={2.5} stroke="#374151" strokeWidth={1.5} fill="none" />
                  <line x1={cx} y1={62} x2={cx} y2={72} stroke="#374151" strokeWidth={1.5} />
                  <circle cx={cx} cy={72} r={2.5} stroke="#374151" strokeWidth={1.5} fill="none" />
                </g>
              ))}
              {/* Stone cracks */}
              <path d="M35 35 L37 40 L34 45" stroke="#374151" strokeWidth={1} fill="none" />
              <path d="M50 38 L48 43" stroke="#374151" strokeWidth={1} fill="none" />
            </motion.g>
          </motion.g>
        )}

        {stage === 1 && (
          <motion.g key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Cracked golem, one eye open */}
            <motion.g animate={{ y: [0, -1, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
              <rect x={25} y={30} width={30} height={32} rx={6} fill="#4b5563" />
              <rect x={28} y={18} width={24} height={20} rx={5} fill="#6b7280" />
              {/* One X, one amber eye */}
              <text x={33} y={32} fontSize={7} fill="#374151" fontWeight="bold">✕</text>
              <motion.circle cx={45} cy={28} r={3.5} fill="#f59e0b"
                animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 1.2 }} />
              {/* Large crack */}
              <motion.path d="M40 18 L37 28 L42 32 L38 45 L40 62"
                stroke="#d1fae5" strokeWidth={1.5} fill="none" strokeLinecap="round"
                animate={{ pathLength: [0, 1] }} transition={{ duration: 1.5, ease: "easeOut" }} />
              {/* Chain broken on one side */}
              <circle cx={38} cy={65} r={2.5} stroke="#374151" strokeWidth={1.5} fill="none" />
              <line x1={38} y1={62} x2={38} y2={68} stroke="#374151" strokeWidth={1.5} />
            </motion.g>
          </motion.g>
        )}

        {stage === 2 && (
          <motion.g key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Standing golem, both eyes open */}
            <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              <rect x={25} y={28} width={30} height={34} rx={6} fill="#4b5563" />
              <rect x={28} y={14} width={24} height={22} rx={5} fill="#6b7280" />
              {/* Amber eyes */}
              <motion.circle cx={34} cy={25} r={3.5} fill="#f59e0b"
                animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.3 }} />
              <motion.circle cx={46} cy={25} r={3.5} fill="#f59e0b"
                animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.3, delay: 0.2 }} />
              {/* Arms */}
              <rect x={13} y={32} width={12} height={8} rx={4} fill="#4b5563" />
              <rect x={55} y={32} width={12} height={8} rx={4} fill="#4b5563" />
              {/* Legs */}
              <rect x={28} y={60} width={10} height={12} rx={4} fill="#374151" />
              <rect x={42} y={60} width={10} height={12} rx={4} fill="#374151" />
            </motion.g>
          </motion.g>
        )}

        {stage === 3 && (
          <motion.g key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Glowing core golem with orbiting crystals */}
            <motion.g animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              {/* Glowing core */}
              <motion.ellipse cx={40} cy={44} rx={10} ry={12} fill="#f59e0b" opacity={0.15}
                animate={{ rx: [10, 13, 10], ry: [12, 15, 12] }} transition={{ repeat: Infinity, duration: 1.5 }} />
              <rect x={25} y={28} width={30} height={34} rx={6} fill="#374151" />
              <motion.rect x={32} y={38} width={16} height={14} rx={4} fill="#f59e0b" opacity={0.3}
                animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 1.2 }} />
              <rect x={28} y={14} width={24} height={22} rx={5} fill="#4b5563" />
              {/* Bright eyes */}
              <motion.circle cx={34} cy={25} r={4} fill="#fde68a"
                animate={{ r: [4, 5, 4] }} transition={{ repeat: Infinity, duration: 0.9 }} />
              <motion.circle cx={46} cy={25} r={4} fill="#fde68a"
                animate={{ r: [4, 5, 4] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.15 }} />
              {/* Arms */}
              <rect x={13} y={32} width={12} height={8} rx={4} fill="#374151" />
              <rect x={55} y={32} width={12} height={8} rx={4} fill="#374151" />
              {/* Legs */}
              <rect x={28} y={60} width={10} height={12} rx={4} fill="#374151" />
              <rect x={42} y={60} width={10} height={12} rx={4} fill="#374151" />
            </motion.g>
            {/* Orbiting crystals */}
            {[0, 120, 240].map((deg, i) => (
              <motion.g key={i}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: i * 0 }}
                style={{ transformOrigin: "40px 44px" }}
              >
                <motion.polygon
                  points={`${40 + 22 * Math.cos((deg * Math.PI) / 180)},${44 + 22 * Math.sin((deg * Math.PI) / 180) - 4} ${40 + 22 * Math.cos((deg * Math.PI) / 180) - 3},${44 + 22 * Math.sin((deg * Math.PI) / 180) + 3} ${40 + 22 * Math.cos((deg * Math.PI) / 180) + 3},${44 + 22 * Math.sin((deg * Math.PI) / 180) + 3}`}
                  fill="#f59e0b" opacity={0.8}
                />
              </motion.g>
            ))}
          </motion.g>
        )}

        {stage === 4 && (
          <motion.g key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Golden crowned golem */}
            <motion.g animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
              {/* Glow aura */}
              <motion.circle cx={40} cy={44} r={30} fill="#fbbf24" opacity={0.08}
                animate={{ r: [30, 34, 30] }} transition={{ repeat: Infinity, duration: 2 }} />
              <rect x={25} y={28} width={30} height={34} rx={6} fill="#92400e" />
              {/* Golden chest plate */}
              <rect x={29} y={33} width={22} height={20} rx={3} fill="#fbbf24" opacity={0.3} />
              <rect x={28} y={14} width={24} height={22} rx={5} fill="#b45309" />
              {/* Crown */}
              <path d="M28 14 L30 9 L34 13 L40 7 L46 13 L50 9 L52 14 Z" fill="#fbbf24" />
              <circle cx={40} cy={8} r={2} fill="#f87171" />
              {/* Golden eyes */}
              <motion.circle cx={34} cy={25} r={4.5} fill="#fde68a"
                animate={{ r: [4.5, 5.5, 4.5] }} transition={{ repeat: Infinity, duration: 0.8 }} />
              <motion.circle cx={46} cy={25} r={4.5} fill="#fde68a"
                animate={{ r: [4.5, 5.5, 4.5] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }} />
              {/* Arms */}
              <rect x={13} y={32} width={12} height={8} rx={4} fill="#92400e" />
              <rect x={55} y={32} width={12} height={8} rx={4} fill="#92400e" />
              {/* Legs */}
              <rect x={28} y={60} width={10} height={12} rx={4} fill="#78350f" />
              <rect x={42} y={60} width={10} height={12} rx={4} fill="#78350f" />
            </motion.g>
            {/* Fast orbiting crystals */}
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <motion.g key={i}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{ transformOrigin: "40px 44px" }}
              >
                <circle
                  cx={40 + 24 * Math.cos((deg * Math.PI) / 180)}
                  cy={44 + 24 * Math.sin((deg * Math.PI) / 180)}
                  r={2.5} fill="#fbbf24"
                />
              </motion.g>
            ))}
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

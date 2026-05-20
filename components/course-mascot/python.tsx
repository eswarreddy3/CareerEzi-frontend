"use client"

import { motion, AnimatePresence } from "framer-motion"

interface Props { stage: 0 | 1 | 2 | 3 | 4 }

// Stage 0: Sad coiled snake inside a cage — bars over it, droopy eyes
// Stage 1: One bent bar, snake head peeking out with curious tongue
// Stage 2: Fully free, happy coiled snake, bouncy float
// Stage 3: Cobra raised, glowing eyes, hood flared, tongue flick
// Stage 4: Royal cobra — golden scales, crown, sparkles orbiting

export function PythonMascot({ stage }: Props) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <AnimatePresence mode="wait">

        {/* ── STAGE 0: Caged sad snake ── */}
        {stage === 0 && (
          <motion.g key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Cage frame */}
            <rect x={14} y={8} width={72} height={84} rx={6} stroke="#444" strokeWidth={2} fill="none" />
            <rect x={14} y={8} width={72} height={6} rx={3} fill="#444" />
            <rect x={14} y={86} width={72} height={6} rx={3} fill="#444" />
            {/* Vertical bars */}
            {[22, 34, 46, 58, 70, 80].map((x, i) => (
              <rect key={i} x={x} y={8} width={4} height={84} rx={2} fill="#3a3a3a" />
            ))}
            {/* Snake coiled inside */}
            <motion.g
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              {/* Body coils */}
              <ellipse cx={50} cy={68} rx={22} ry={12} stroke="#4ade80" strokeWidth={5} fill="none" strokeLinecap="round" />
              <ellipse cx={50} cy={55} rx={14} ry={8} stroke="#4ade80" strokeWidth={5} fill="none" strokeLinecap="round" />
              {/* Neck */}
              <path d="M58 48 Q64 42 60 36" stroke="#4ade80" strokeWidth={6} fill="none" strokeLinecap="round" />
              {/* Head */}
              <ellipse cx={57} cy={33} rx={9} ry={6} fill="#4ade80" />
              <ellipse cx={57} cy={33} rx={9} ry={6} fill="url(#snakeGrad0)" />
              {/* Sad eyes — droopy */}
              <circle cx={53} cy={31} r={2.5} fill="#1a2a1a" />
              <circle cx={61} cy={31} r={2.5} fill="#1a2a1a" />
              <circle cx={53.5} cy={30.5} r={0.8} fill="#6ee7b7" />
              <circle cx={61.5} cy={30.5} r={0.8} fill="#6ee7b7" />
              {/* Sad eyebrows */}
              <path d="M51 28.5 Q53 27 55 28.5" stroke="#166534" strokeWidth={1.2} fill="none" />
              <path d="M59 28.5 Q61 27 63 28.5" stroke="#166534" strokeWidth={1.2} fill="none" />
              {/* Sad mouth */}
              <path d="M53 35.5 Q57 33.5 61 35.5" stroke="#166534" strokeWidth={1.2} fill="none" />
              {/* Tears */}
              <motion.ellipse cx={52} cy={34} rx={1} ry={1.5} fill="#93c5fd" opacity={0.7}
                animate={{ y: [0, 3, 6], opacity: [0.7, 0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
              />
            </motion.g>
            <defs>
              <linearGradient id="snakeGrad0" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#166534" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </motion.g>
        )}

        {/* ── STAGE 1: Bent bar, peeking head ── */}
        {stage === 1 && (
          <motion.g key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Cage (one bar bent) */}
            <rect x={14} y={8} width={72} height={84} rx={6} stroke="#444" strokeWidth={2} fill="none" />
            <rect x={14} y={8} width={72} height={6} rx={3} fill="#444" />
            <rect x={14} y={86} width={72} height={6} rx={3} fill="#444" />
            {[22, 34, 58, 70, 80].map((x, i) => (
              <rect key={i} x={x} y={8} width={4} height={84} rx={2} fill="#3a3a3a" />
            ))}
            {/* Bent bar at ~46 */}
            <path d="M46 8 L46 38 L56 50 L46 62 L46 92" stroke="#3a3a3a" strokeWidth={4} fill="none" strokeLinecap="round" />

            {/* Body still inside */}
            <ellipse cx={44} cy={72} rx={18} ry={10} stroke="#4ade80" strokeWidth={5} fill="none" />
            <ellipse cx={44} cy={60} rx={11} ry={7} stroke="#4ade80" strokeWidth={4} fill="none" />

            {/* Head peeking through the gap */}
            <motion.g
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <path d="M44 53 Q52 48 58 46" stroke="#4ade80" strokeWidth={6} fill="none" strokeLinecap="round" />
              <ellipse cx={62} cy={44} rx={9} ry={6} fill="#4ade80" />
              {/* Alert eyes */}
              <circle cx={58} cy={42} r={2.5} fill="#1a2a1a" />
              <circle cx={66} cy={42} r={2.5} fill="#1a2a1a" />
              <circle cx={58.6} cy={41.5} r={0.9} fill="#86efac" />
              <circle cx={66.6} cy={41.5} r={0.9} fill="#86efac" />
              {/* Curious expression */}
              <path d="M58 45.5 Q62 47 66 45.5" stroke="#166534" strokeWidth={1.2} fill="none" />
              {/* Tongue flick */}
              <motion.g
                animate={{ scaleX: [1, 1.3, 1], opacity: [1, 1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.7, repeatDelay: 1.2 }}
                style={{ transformOrigin: "68px 44px" }}
              >
                <path d="M70 44 L76 44 L78 41.5 M76 44 L78 46.5"
                  stroke="#f87171" strokeWidth={1.8} fill="none" strokeLinecap="round" />
              </motion.g>
            </motion.g>
          </motion.g>
        )}

        {/* ── STAGE 2: Free happy coiled snake ── */}
        {stage === 2 && (
          <motion.g key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.g
              animate={{ y: [0, -5, 0], rotate: [0, 1, -1, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              style={{ transformOrigin: "50px 60px" }}
            >
              {/* Coils */}
              <ellipse cx={50} cy={72} rx={24} ry={14} stroke="#22c55e" strokeWidth={6} fill="none" />
              <ellipse cx={50} cy={57} rx={15} ry={9} stroke="#22c55e" strokeWidth={5} fill="none" />
              {/* Neck + head */}
              <path d="M60 50 Q68 42 64 34" stroke="#22c55e" strokeWidth={7} fill="none" strokeLinecap="round" />
              <ellipse cx={61} cy={31} rx={11} ry={7.5} fill="#22c55e" />
              {/* Shine on head */}
              <ellipse cx={58} cy={28} rx={4} ry={2.5} fill="#86efac" opacity={0.4} />
              {/* Happy eyes */}
              <circle cx={56} cy={29} r={3} fill="#14532d" />
              <circle cx={66} cy={29} r={3} fill="#14532d" />
              <circle cx={57} cy={28.2} r={1.1} fill="#bbf7d0" />
              <circle cx={67} cy={28.2} r={1.1} fill="#bbf7d0" />
              {/* Big smile */}
              <path d="M55 33.5 Q61 37 67 33.5" stroke="#14532d" strokeWidth={1.5} fill="none" />
              {/* Cheek blush */}
              <ellipse cx={53} cy={33} rx={2.5} ry={1.5} fill="#f9a8d4" opacity={0.5} />
              <ellipse cx={69} cy={33} rx={2.5} ry={1.5} fill="#f9a8d4" opacity={0.5} />
              {/* Tongue */}
              <motion.g
                animate={{ opacity: [1, 1, 0, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, repeatDelay: 2 }}
              >
                <path d="M70 31 L76 31 L78 28.5 M76 31 L78 33.5"
                  stroke="#f87171" strokeWidth={2} fill="none" strokeLinecap="round" />
              </motion.g>
            </motion.g>
          </motion.g>
        )}

        {/* ── STAGE 3: Cobra raised with glowing eyes ── */}
        {stage === 3 && (
          <motion.g key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.g
              animate={{ y: [0, -3, 0], rotate: [0, 0.8, -0.8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ transformOrigin: "50px 55px" }}
            >
              {/* Ground coil */}
              <ellipse cx={50} cy={78} rx={26} ry={13} stroke="#16a34a" strokeWidth={6} fill="none" />
              {/* Rising body — S-curve */}
              <path d="M50 65 Q40 54 50 43 Q58 34 52 24"
                stroke="#16a34a" strokeWidth={9} fill="none" strokeLinecap="round" />
              {/* Hood */}
              <motion.ellipse cx={50} cy={20} rx={17} ry={10}
                fill="#15803d" opacity={0.75}
                animate={{ rx: [17, 19, 17] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              />
              <ellipse cx={50} cy={20} rx={14} ry={8} fill="#166534" opacity={0.5} />
              {/* Head */}
              <ellipse cx={50} cy={20} rx={10} ry={7} fill="#22c55e" />
              <ellipse cx={47} cy={17} rx={4} ry={2.5} fill="#86efac" opacity={0.35} />
              {/* Glowing eyes */}
              <motion.circle cx={44} cy={18} r={3.5} fill="#4ade80"
                animate={{ r: [3.5, 4.5, 3.5], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <motion.circle cx={56} cy={18} r={3.5} fill="#4ade80"
                animate={{ r: [3.5, 4.5, 3.5], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.15 }}
              />
              <circle cx={44.8} cy={17.4} r={1.2} fill="#dcfce7" />
              <circle cx={56.8} cy={17.4} r={1.2} fill="#dcfce7" />
              {/* Slit pupils */}
              <rect x={43.6} y={16.5} width={0.8} height={3} rx={0.4} fill="#052e16" />
              <rect x={55.6} y={16.5} width={0.8} height={3} rx={0.4} fill="#052e16" />
              {/* Fangs */}
              <path d="M46 24 L45 28" stroke="#dcfce7" strokeWidth={1.5} strokeLinecap="round" />
              <path d="M54 24 L55 28" stroke="#dcfce7" strokeWidth={1.5} strokeLinecap="round" />
              {/* Tongue — fast flick */}
              <motion.g
                animate={{ scaleY: [1, 1.4, 1], opacity: [1, 1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.35, repeatDelay: 0.9 }}
                style={{ transformOrigin: "50px 26px" }}
              >
                <path d="M50 26 L50 32 L47 36 M50 32 L53 36"
                  stroke="#f87171" strokeWidth={2} fill="none" strokeLinecap="round" />
              </motion.g>
              {/* Glow dots on hood */}
              {[[-10, 16], [10, 16], [-14, 22], [14, 22]].map(([dx, dy], i) => (
                <motion.circle key={i} cx={50 + dx} cy={dy} r={1.5}
                  fill="#4ade80" opacity={0.6}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.25 }}
                />
              ))}
            </motion.g>
          </motion.g>
        )}

        {/* ── STAGE 4: Royal cobra — crown, golden scales, sparkles ── */}
        {stage === 4 && (
          <motion.g key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Orbiting sparkles */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.g key={i}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4 + i * 0.2, ease: "linear" }}
                style={{ transformOrigin: "50px 42px" }}
              >
                <motion.circle
                  cx={50 + 36 * Math.cos((deg * Math.PI) / 180)}
                  cy={42 + 36 * Math.sin((deg * Math.PI) / 180)}
                  r={2}
                  fill="#fbbf24"
                  animate={{ opacity: [0.3, 1, 0.3], r: [1.5, 2.5, 1.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.25 }}
                />
              </motion.g>
            ))}

            <motion.g
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              style={{ transformOrigin: "50px 55px" }}
            >
              {/* Ground coil — golden */}
              <ellipse cx={50} cy={80} rx={28} ry={14} stroke="#fbbf24" strokeWidth={7} fill="none" />
              <ellipse cx={50} cy={70} rx={18} ry={9} stroke="#f59e0b" strokeWidth={5} fill="none" />
              {/* Rising body */}
              <path d="M50 62 Q38 50 50 38 Q60 28 54 18"
                stroke="#fbbf24" strokeWidth={10} fill="none" strokeLinecap="round" />
              {/* Scale pattern on body */}
              {[[46, 56], [52, 50], [46, 44], [52, 38]].map(([bx, by], i) => (
                <ellipse key={i} cx={bx} cy={by} rx={3} ry={2}
                  fill="none" stroke="#f59e0b" strokeWidth={0.8} opacity={0.6} />
              ))}
              {/* Hood — large gold-tipped */}
              <motion.ellipse cx={52} cy={15} rx={20} ry={12}
                fill="#854d0e" opacity={0.6}
                animate={{ rx: [20, 23, 20] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              />
              <motion.ellipse cx={52} cy={15} rx={16} ry={9}
                fill="#713f12" opacity={0.5}
                animate={{ rx: [16, 18, 16] }}
                transition={{ repeat: Infinity, duration: 1.6, delay: 0.1 }}
              />
              {/* Hood gold border */}
              <motion.ellipse cx={52} cy={15} rx={20} ry={12}
                stroke="#fbbf24" strokeWidth={1.5} fill="none" opacity={0.5}
                animate={{ rx: [20, 23, 20] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              />
              {/* Head */}
              <ellipse cx={52} cy={16} rx={11} ry={8} fill="#ca8a04" />
              <ellipse cx={52} cy={16} rx={10} ry={7} fill="#fbbf24" />
              {/* Head shine */}
              <ellipse cx={49} cy={13} rx={4} ry={2.5} fill="#fde68a" opacity={0.5} />
              {/* Crown */}
              <path d="M42 11 L44 5 L48 9 L52 3 L56 9 L60 5 L62 11 Z" fill="#fbbf24" />
              <path d="M42 11 L62 11" stroke="#f59e0b" strokeWidth={1.5} />
              {/* Crown gems */}
              <circle cx={52} cy={4} r={2.5} fill="#f87171" />
              <circle cx={45} cy={8} r={1.5} fill="#a78bfa" />
              <circle cx={59} cy={8} r={1.5} fill="#34d399" />
              {/* Glowing eyes */}
              <motion.circle cx={46} cy={15} r={4} fill="#fde68a"
                animate={{ r: [4, 5.5, 4] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
              <motion.circle cx={58} cy={15} r={4} fill="#fde68a"
                animate={{ r: [4, 5.5, 4] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.1 }}
              />
              <circle cx={47} cy={14} r={1.5} fill="#fff" opacity={0.9} />
              <circle cx={59} cy={14} r={1.5} fill="#fff" opacity={0.9} />
              <rect x={45.6} y={13} width={0.8} height={4} rx={0.4} fill="#78350f" />
              <rect x={57.6} y={13} width={0.8} height={4} rx={0.4} fill="#78350f" />
              {/* Gold fangs */}
              <path d="M48 21 L47 26" stroke="#fde68a" strokeWidth={2} strokeLinecap="round" />
              <path d="M56 21 L57 26" stroke="#fde68a" strokeWidth={2} strokeLinecap="round" />
              {/* Tongue — gold */}
              <motion.g
                animate={{ opacity: [1, 1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.4, repeatDelay: 0.7 }}
              >
                <path d="M52 24 L52 30 L49 34 M52 30 L55 34"
                  stroke="#fbbf24" strokeWidth={2} fill="none" strokeLinecap="round" />
              </motion.g>
              {/* Aura glow */}
              <motion.ellipse cx={52} cy={16} rx={14} ry={10}
                fill="none" stroke="#fbbf24" strokeWidth={1} opacity={0.2}
                animate={{ rx: [14, 18, 14], ry: [10, 14, 10], opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

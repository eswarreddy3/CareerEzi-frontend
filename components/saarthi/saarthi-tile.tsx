"use client"

/**
 * Saarthi's participant tile — the "AI cameo".
 *
 * Sits beside the student's camera tile so the room reads as a real two-person
 * video call rather than a form with an orb on it. The active speaker gets a
 * glowing border, exactly like Meet or Zoom, which is what makes the turn-taking
 * legible without anyone having to explain it.
 *
 * The waveform is synthetic — driven by whether SpeechSynthesis is currently
 * speaking, not by real audio analysis. Browsers don't expose the synth output
 * as a stream to analyse, and a plausible animated waveform reads as "she's
 * talking" just as well while costing nothing.
 */

import { motion } from "framer-motion"
import { Mic, MicOff, Volume2 } from "lucide-react"

import { SaarthiOrb, type SaarthiMood } from "@/components/saarthi/orb"
import { cn } from "@/lib/utils"

export function SaarthiTile({
  mood, speaking, thinking, className,
}: {
  mood: SaarthiMood
  speaking: boolean
  thinking: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 bg-card transition-colors duration-300",
        speaking ? "border-primary" : "border-border",
        className,
      )}
    >
      {/* Active-speaker glow */}
      {speaking && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          animate={{ boxShadow: [
            "inset 0 0 30px 0 var(--primary)",
            "inset 0 0 55px 0 var(--primary)",
            "inset 0 0 30px 0 var(--primary)",
          ] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ opacity: 0.18 }}
        />
      )}

      {/* Ambient rings — makes the tile feel occupied rather than blank */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border border-primary/15"
            style={{ width: 150 + i * 62, height: 150 + i * 62 }}
            animate={speaking || thinking
              ? { scale: [1, 1.05, 1], opacity: [0.25, 0.5, 0.25] }
              : { scale: 1, opacity: 0.15 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
          />
        ))}
      </div>

      <SaarthiOrb mood={mood} size={132} />

      {/* Speaking waveform */}
      <div className="relative mt-3 flex h-7 items-end gap-[3px]">
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.span
            key={i}
            className={cn("w-[3px] rounded-full",
                          speaking ? "bg-primary" : thinking ? "bg-coding/60" : "bg-border")}
            animate={speaking
              ? { height: [4, 6 + Math.random() * 20, 4] }
              : thinking ? { height: [4, 9, 4] } : { height: 4 }}
            transition={{
              duration: speaking ? 0.45 + Math.random() * 0.35 : 1.1,
              repeat: Infinity, delay: i * 0.035, ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Name plate */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-2.5">
        <span className="flex items-center gap-1.5 text-xs font-medium text-white">
          <span className={cn("h-1.5 w-1.5 rounded-full",
                              speaking ? "bg-primary" : "bg-white/40")} />
          Saarthi · Interviewer
        </span>
        <span className="grid h-6 w-6 place-items-center rounded-md bg-black/40">
          {speaking ? <Volume2 className="h-3.5 w-3.5 text-primary" />
                    : <Mic className="h-3.5 w-3.5 text-white/50" />}
        </span>
      </div>

      {thinking && (
        <span className="absolute left-2.5 top-2.5 font-mono text-[10px] tracking-widest text-coding">
          THINKING…
        </span>
      )}
    </div>
  )
}

/** The student's own tile — camera self-view with a matching name plate. */
export function CandidateTile({
  videoRef, cameraOn, camError, micOn, level, name, className,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>
  cameraOn: boolean
  camError: string | null
  micOn: boolean
  level: number
  name: string
  className?: string
}) {
  const talking = micOn && level > 0.08

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 bg-card transition-colors duration-300",
        talking ? "border-success" : "border-border",
        className,
      )}
    >
      {cameraOn && !camError ? (
        <video ref={videoRef} autoPlay playsInline muted
               className="h-full w-full scale-x-[-1] object-cover" />
      ) : (
        <div className="grid h-full w-full place-items-center bg-secondary/30 p-4 text-center">
          <div>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary text-xl font-semibold text-muted-foreground">
              {name.slice(0, 1).toUpperCase()}
            </span>
            <p className="mt-2 max-w-[15rem] text-[11px] text-muted-foreground">
              {camError ?? "Camera off"}
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-2.5">
        <span className="flex items-center gap-1.5 text-xs font-medium text-white">
          <span className={cn("h-1.5 w-1.5 rounded-full",
                              talking ? "bg-success" : "bg-white/40")} />
          {name} · You
        </span>
        <span className="grid h-6 w-6 place-items-center rounded-md bg-black/40">
          {micOn ? <Mic className={cn("h-3.5 w-3.5", talking ? "text-success" : "text-white/70")} />
                 : <MicOff className="h-3.5 w-3.5 text-white/50" />}
        </span>
      </div>

      {/* Live level bar along the bottom edge */}
      {micOn && (
        <motion.span
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-success"
          animate={{ scaleX: Math.min(1, level * 1.4) }}
          transition={{ duration: 0.08 }}
        />
      )}
    </div>
  )
}

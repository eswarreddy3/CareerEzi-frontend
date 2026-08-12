"use client"

/**
 * Pre-flight device check — camera, microphone, speaker.
 *
 * Every real interview platform does this, and for a good reason: discovering
 * your mic is dead three questions into an interview is the single most
 * stressful way to fail. Checking first turns a possible disaster into a
 * ten-second inconvenience.
 *
 * Every check is SKIPPABLE. The interview works with no camera, no microphone
 * and no speaker — it simply becomes a typed interview. Blocking a student who
 * is on a lab machine with no webcam would be far worse than a missing
 * self-view.
 *
 * Nothing here is transmitted. The camera preview and the mic meter run
 * entirely in the browser.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle, Camera, CheckCircle2, Loader2, Mic, Volume2, XCircle,
} from "lucide-react"

import { SaarthiOrb } from "@/components/saarthi/orb"
import { Button } from "@/components/ui/button"
import { detectSpeechSupport, speak, stopSpeaking } from "@/lib/speech"
import { cn } from "@/lib/utils"

type Status = "idle" | "testing" | "ok" | "failed" | "skipped"

const TEST_LINE =
  "Hello, I'm Saarthi. If you can hear me clearly, your speakers are working."

export interface DeviceResult {
  camera: boolean
  mic: boolean
  speaker: boolean
}

export function DeviceCheck({ onReady }: { onReady: (r: DeviceResult) => void }) {
  const [cam, setCam] = useState<Status>("idle")
  const [mic, setMic] = useState<Status>("idle")
  const [spk, setSpk] = useState<Status>("idle")
  const [level, setLevel] = useState(0)
  const [peak, setPeak] = useState(0)
  const [camMsg, setCamMsg] = useState("")
  const [micMsg, setMicMsg] = useState("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const camStream = useRef<MediaStream | null>(null)
  const micStream = useRef<MediaStream | null>(null)
  const audioCtx = useRef<AudioContext | null>(null)
  const raf = useRef(0)
  const support = useRef(detectSpeechSupport())

  const stopAll = useCallback(() => {
    cancelAnimationFrame(raf.current)
    camStream.current?.getTracks().forEach((t) => t.stop())
    micStream.current?.getTracks().forEach((t) => t.stop())
    audioCtx.current?.close().catch(() => {})
    camStream.current = null; micStream.current = null; audioCtx.current = null
    stopSpeaking()
  }, [])

  useEffect(() => stopAll, [stopAll])

  // Attach the stream AFTER the render that mounts the <video> element.
  useEffect(() => {
    if (cam !== "ok" || !camStream.current || !videoRef.current) return
    videoRef.current.srcObject = camStream.current
    videoRef.current.play?.().catch(() => { /* autoplay policy — muted, so rare */ })
  }, [cam])

  // ── Camera ────────────────────────────────────────────────────────────────
  async function testCamera() {
    setCam("testing"); setCamMsg("")
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      camStream.current = s
      // Do NOT assign srcObject here. The <video> element is only rendered once
      // cam === "ok", so videoRef.current is still null at this point and the
      // preview silently stays blank. The effect below attaches it after the
      // element actually exists.
      setCam("ok")
    } catch (e: any) {
      setCam("failed")
      setCamMsg(e?.name === "NotAllowedError"
        ? "You blocked camera access. Allow it in your browser, or continue without."
        : "No camera detected. You can continue without one.")
    }
  }

  // ── Microphone ────────────────────────────────────────────────────────────
  async function testMic() {
    setMic("testing"); setMicMsg(""); setPeak(0)
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStream.current = s
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioCtx.current = ctx
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      ctx.createMediaStreamSource(s).connect(analyser)
      const buf = new Uint8Array(analyser.frequencyBinCount)

      const tick = () => {
        analyser.getByteTimeDomainData(buf)
        let p = 0
        for (let i = 0; i < buf.length; i++) p = Math.max(p, Math.abs(buf[i] - 128))
        const v = Math.min(1, p / 55)
        setLevel(v)
        // Only mark it working once we've actually HEARD something. A granted
        // permission on a dead or muted mic still reads as success otherwise.
        setPeak((prev) => {
          const next = Math.max(prev, v)
          if (next > 0.12) setMic("ok")
          return next
        })
        raf.current = requestAnimationFrame(tick)
      }
      tick()
    } catch (e: any) {
      setMic("failed")
      setMicMsg(e?.name === "NotAllowedError"
        ? "You blocked microphone access. Allow it, or type your answers instead."
        : "No microphone detected. You can type your answers instead.")
    }
  }

  // ── Speaker ───────────────────────────────────────────────────────────────
  function testSpeaker() {
    if (!support.current.synthesis) {
      setSpk("failed")
      return
    }
    setSpk("testing")
    speak(TEST_LINE, { onEnd: () => setSpk((s) => (s === "testing" ? "idle" : s)) })
  }

  const micLive = mic === "testing" || mic === "ok"
  const allSettled = cam !== "idle" && mic !== "idle" && spk !== "idle"

  function join() {
    stopAll()
    onReady({ camera: cam === "ok", mic: mic === "ok", speaker: spk === "ok" })
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-4">
      <div className="text-center">
        <SaarthiOrb mood="idle" size={72} className="mx-auto" />
        <h1 className="mt-2 font-serif text-2xl font-bold">Let&apos;s check your setup</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Thirty seconds now saves a scramble mid-interview. You can skip any of these.
        </p>
      </div>

      {/* Camera */}
      <CheckRow
        icon={Camera} title="Camera" status={cam} message={camMsg}
        hint="You'll see yourself the way an interviewer would — posture, eye contact."
        action={
          <Button size="sm" variant={cam === "ok" ? "outline" : "default"} onClick={testCamera}>
            {cam === "testing" ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
            {cam === "ok" ? "Retry" : "Turn on camera"}
          </Button>
        }
      >
        <div className="mt-3 overflow-hidden rounded-xl border border-border bg-secondary/30">
          {cam === "ok" ? (
            <video ref={videoRef} autoPlay playsInline muted
                   className="aspect-video w-full scale-x-[-1] object-cover" />
          ) : (
            <div className="grid aspect-video w-full place-items-center text-xs text-muted-foreground">
              Camera preview appears here
            </div>
          )}
        </div>
        {cam === "ok" && (
          <p className="mt-2 text-center text-xs text-success">
            Can you see yourself? Then your camera is good.
          </p>
        )}
      </CheckRow>

      {/* Microphone */}
      <CheckRow
        icon={Mic} title="Microphone" status={mic} message={micMsg}
        hint="Speak normally — the bars should move. This is how Saarthi hears your answers."
        action={
          <Button size="sm" variant={mic === "ok" ? "outline" : "default"} onClick={testMic}>
            {mic === "testing" ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
            {mic === "ok" ? "Retry" : "Test microphone"}
          </Button>
        }
      >
        <div className="mt-3 flex h-12 items-end justify-center gap-[3px] rounded-xl border border-border bg-secondary/30 px-3 pb-2">
          {Array.from({ length: 32 }).map((_, i) => {
            const falloff = 1 - Math.abs(i - 15.5) / 18
            const h = micLive ? 3 + level * 32 * falloff * (0.5 + Math.random() * 0.5) : 3
            return (
              <span key={i}
                className={cn("w-[3px] rounded-full transition-[height] duration-75",
                              level > 0.05 ? "bg-success" : "bg-muted-foreground/30")}
                style={{ height: `${h}px` }} />
            )
          })}
        </div>
        {mic === "testing" && peak <= 0.12 && (
          <p className="mt-2 text-center text-xs text-warning">Say something…</p>
        )}
        {mic === "ok" && (
          <p className="mt-2 text-center text-xs text-success">Heard you clearly.</p>
        )}
        {!support.current.recognition && (
          <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-warning/30 bg-warning/10 p-2 text-[11px] text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
            This browser can&apos;t convert speech to text (Firefox doesn&apos;t support it).
            You can still do the interview by typing.
          </p>
        )}
      </CheckRow>

      {/* Speaker */}
      <CheckRow
        icon={Volume2} title="Speaker" status={spk}
        hint="Saarthi reads each question aloud, like a real interviewer."
        action={
          <div className="flex gap-1.5">
            <Button size="sm" variant="default" onClick={testSpeaker}>
              {spk === "testing" ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              Play test
            </Button>
            {spk !== "ok" && (
              <Button size="sm" variant="outline" onClick={() => setSpk("ok")}>
                I heard it
              </Button>
            )}
          </div>
        }
      >
        {spk === "testing" && (
          <p className="mt-2 text-xs text-muted-foreground">“{TEST_LINE}”</p>
        )}
      </CheckRow>

      <div className="flex flex-col items-center gap-2 pt-2">
        <Button size="lg" onClick={join} className="w-full sm:w-auto">
          {allSettled ? "Join interview" : "Skip checks and join"}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          Nothing here is recorded or uploaded. Your camera and microphone stay on your device.
        </p>
      </div>
    </div>
  )
}

function CheckRow({
  icon: Icon, title, status, hint, message, action, children,
}: {
  icon: typeof Camera; title: string; status: Status; hint: string
  message?: string; action: React.ReactNode; children?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl border",
            status === "ok" ? "border-success/40 bg-success/10 text-success"
            : status === "failed" ? "border-warning/40 bg-warning/10 text-warning"
            : "border-border bg-secondary/40 text-muted-foreground")}>
            <AnimatePresence mode="wait">
              {status === "ok" ? (
                <motion.span key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 className="h-4 w-4" />
                </motion.span>
              ) : status === "failed" ? (
                <motion.span key="no" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <XCircle className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span key="idle"><Icon className="h-4 w-4" /></motion.span>
              )}
            </AnimatePresence>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{message || hint}</p>
          </div>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
      {children}
    </div>
  )
}

"use client"

/**
 * The interview room — a two-person video call with Saarthi.
 *
 * Flow: device check → call. The check exists because discovering a dead mic
 * three questions in is the most stressful possible way to fail; every check
 * is skippable and the interview works with no camera, mic or speaker at all.
 *
 * Cost: the model only ever sees TEXT. Speech↔text happens in the browser, so
 * a spoken interview costs the same ~₹0.02 as a typed one.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight, Loader2, Maximize2, Mic, MicOff, Minimize2, PhoneOff, Send,
  Video, VideoOff,
} from "lucide-react"
import { toast } from "sonner"

import { SaarthiOrb, type SaarthiMood } from "@/components/saarthi/orb"
import { SaarthiTile, CandidateTile } from "@/components/saarthi/saarthi-tile"
import { DeviceCheck, type DeviceResult } from "@/components/saarthi/device-check"
import { InterviewReportView } from "@/components/saarthi/interview-report"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/store/authStore"
import {
  answerInterview, endInterview, fetchInterview,
  type InterviewReport, type InterviewSession,
} from "@/lib/ai"
import {
  detectSpeechSupport, listen, speak, stopSpeaking, warmVoices, type Listener,
} from "@/lib/speech"
import { cn } from "@/lib/utils"

type Phase = "loading" | "check" | "call" | "report"

export default function InterviewRoomPage() {
  const { uid } = useParams<{ uid: string }>()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const firstName = (user?.name ?? "You").split(" ")[0]

  const [phase, setPhase] = useState<Phase>("loading")
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [question, setQuestion] = useState("")
  const [turn, setTurn] = useState(1)
  const [totalTurns, setTotalTurns] = useState(10)
  const [draft, setDraft] = useState("")
  const [interim, setInterim] = useState("")
  const [speaking, setSpeaking] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [report, setReport] = useState<InterviewReport | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [cameraOn, setCameraOn] = useState(false)
  const [camError, setCamError] = useState<string | null>(null)
  const [micOn, setMicOn] = useState(false)
  const [level, setLevel] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [support] = useState(() => detectSpeechSupport())

  const listener = useRef<Listener | null>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const camStream = useRef<MediaStream | null>(null)
  const meterStream = useRef<MediaStream | null>(null)
  const audioCtx = useRef<AudioContext | null>(null)
  const raf = useRef(0)

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    warmVoices()
    fetchInterview(uid)
      .then((s) => {
        setSession(s); setTotalTurns(s.total_turns)
        if (s.status === "completed") { setReport(s.report); setPhase("report"); return }
        const pending = (s.transcript ?? []).find((t) => t.answer === null)
        if (pending) { setQuestion(pending.question); setTurn(pending.turn) }
        setPhase("check")
      })
      .catch(() => { toast.error("Could not load this interview"); setPhase("check") })
  }, [uid])

  // ── Media, started only after the device check ────────────────────────────
  const openCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
      })
      camStream.current = s
      // Same trap as the device check: CandidateTile only renders the <video>
      // when cameraOn is true, so the ref is null right now. The effect below
      // attaches the stream once the element is on screen.
      setCameraOn(true); setCamError(null)
    } catch (e: any) {
      setCameraOn(false)
      setCamError(e?.name === "NotAllowedError" ? "Camera blocked" : "No camera")
    }
  }, [])

  const closeCamera = useCallback(() => {
    camStream.current?.getTracks().forEach((t) => t.stop())
    camStream.current = null
    setCameraOn(false)
  }, [])

  const startMeter = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true })
      meterStream.current = s
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
        setLevel(Math.min(1, p / 55))
        raf.current = requestAnimationFrame(tick)
      }
      tick()
    } catch { /* no mic — bars stay flat, typing still works */ }
  }, [])

  // Attach the camera stream after the element mounts.
  useEffect(() => {
    if (!cameraOn || !camStream.current || !videoRef.current) return
    videoRef.current.srcObject = camStream.current
    videoRef.current.play?.().catch(() => { /* muted autoplay, rarely blocked */ })
  }, [cameraOn, phase])

  useEffect(() => () => {
    cancelAnimationFrame(raf.current)
    camStream.current?.getTracks().forEach((t) => t.stop())
    meterStream.current?.getTracks().forEach((t) => t.stop())
    audioCtx.current?.close().catch(() => {})
    stopSpeaking(); listener.current?.abort()
  }, [])

  function onDevicesReady(r: DeviceResult) {
    setPhase("call")
    // Try the camera even if the check was skipped — permission is already
    // granted in the common case, and the toggle can turn it off. A blank tile
    // with no explanation is the worse outcome.
    openCamera()
    if (r.mic) startMeter()
    else startMeter()   // harmless if denied; the meter just stays flat
  }

  // ── Saarthi reads each question ───────────────────────────────────────────
  useEffect(() => {
    if (phase !== "call" || !question || report) return
    if (!support.synthesis) return
    setSpeaking(true)
    const cancel = speak(question, { onEnd: () => setSpeaking(false) })
    return cancel
  }, [question, phase, report, support.synthesis])

  // ── Fullscreen ────────────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) { await shellRef.current?.requestFullscreen(); setFullscreen(true) }
      else { await document.exitFullscreen(); setFullscreen(false) }
    } catch { /* browser refused */ }
  }, [])

  useEffect(() => {
    const h = () => setFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", h)
    return () => document.removeEventListener("fullscreenchange", h)
  }, [])

  // ── Mic ───────────────────────────────────────────────────────────────────
  function startListening() {
    stopSpeaking(); setSpeaking(false)
    if (!support.recognition) {
      toast.error("Speech recognition isn't available here — type your answer instead.")
      return
    }
    const l = listen({
      onInterim: setInterim,
      onFinal: (t) => { if (t) setDraft((d) => (d ? `${d} ${t}` : t)); setInterim("") },
      onError: (code) => {
        setMicOn(false)
        toast.error(code === "not-allowed" ? "Microphone blocked. Type instead."
          : code === "audio-capture" ? "No microphone found. Type instead."
          : "Couldn't hear you. Type instead.")
      },
      onEnd: () => setMicOn(false),
    })
    if (!l) { toast.error("Couldn't start the microphone."); return }
    listener.current = l
    setMicOn(true)
  }

  function stopListening() {
    listener.current?.stop(); listener.current = null; setMicOn(false)
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function submit() {
    const text = (draft + " " + interim).trim()
    if (!text || submitting) return
    stopListening(); stopSpeaking(); setSpeaking(false)
    setSubmitting(true); setThinking(true)
    try {
      const res = await answerInterview(uid, text)
      setDraft(""); setInterim("")
      if (res.done) { setReport(res.report ?? null); setPhase("report") }
      else { setQuestion(res.question ?? ""); setTurn(res.turn ?? turn + 1) }
    } catch {
      toast.error("Couldn't send your answer. Try again.")
    } finally { setSubmitting(false); setThinking(false) }
  }

  async function endNow() {
    stopListening(); stopSpeaking()
    setSubmitting(true)
    try { const r = await endInterview(uid); setReport(r.report); setPhase("report") }
    catch { toast.error("Couldn't end the interview") }
    finally { setSubmitting(false) }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="text-center">
          <SaarthiOrb mood="thinking" size={80} />
          <p className="mt-3 font-mono text-xs tracking-widest text-muted-foreground">
            PREPARING YOUR INTERVIEW
          </p>
        </div>
      </div>
    )
  }

  if (phase === "report" && report) {
    return (
      <div ref={shellRef} className="min-h-screen overflow-y-auto p-4 sm:p-8">
        <InterviewReportView report={report} session={session}
                             onClose={() => router.push("/mock-interview")} />
      </div>
    )
  }

  if (phase === "check") {
    return (
      <div ref={shellRef} className="min-h-screen overflow-y-auto py-6">
        <DeviceCheck onReady={onDevicesReady} />
      </div>
    )
  }

  const mood: SaarthiMood = speaking ? "speaking" : thinking ? "thinking"
    : micOn ? "listening" : "idle"
  const liveText = (draft + (interim ? ` ${interim}` : "")).trim()

  return (
    <div ref={shellRef} className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Call bar */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">{session?.track_label}</p>
          <p className="truncate font-mono text-[10px] tracking-wide text-muted-foreground">
            {session?.level_label} · {session?.round_label}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            {Array.from({ length: totalTurns }).map((_, i) => (
              <span key={i} className={cn("h-1 w-4 rounded-full",
                i < turn - 1 ? "bg-success" : i === turn - 1 ? "bg-primary" : "bg-border")} />
            ))}
          </div>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {turn}/{totalTurns}
          </span>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Two-tile call */}
      <main className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[1fr_360px]">
        <div className="flex min-h-0 flex-col gap-3">
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <SaarthiTile mood={mood} speaking={speaking} thinking={thinking}
                         className="min-h-[200px]" />
            <CandidateTile videoRef={videoRef} cameraOn={cameraOn} camError={camError}
                           micOn={micOn} level={level} name={firstName}
                           className="min-h-[200px]" />
          </div>

          {/* Question caption, like live subtitles */}
          <div className="shrink-0 rounded-2xl border border-primary/25 bg-primary/5 p-4">
            <div className="mb-1.5 flex items-center gap-2 font-mono text-[10px] tracking-widest text-primary">
              QUESTION {turn}
              {speaking && <span className="animate-pulse">· speaking</span>}
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={question} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }} className="font-serif text-base leading-snug sm:text-lg">
                {question}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Answer panel */}
        <div className="flex min-h-0 flex-col rounded-2xl border border-border bg-card p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              YOUR ANSWER
            </span>
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              {liveText ? `${liveText.split(/\s+/).length} words` : "—"}
            </span>
          </div>

          {/* Always editable — speech recognition mangles technical words
              ("NumPy" -> "num pie"), and scoring someone on the recogniser's
              mistakes would be worse than not offering voice at all. */}
          <Textarea
            value={liveText}
            onChange={(e) => { setDraft(e.target.value); setInterim("") }}
            placeholder={support.recognition
              ? "Tap Speak and answer out loud, or type here…"
              : "Type your answer here…"}
            className="min-h-0 flex-1 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          />

          <div className="mt-2 space-y-2 border-t border-border pt-2">
            <div className="flex gap-2">
              <Button
                variant={micOn ? "default" : "outline"} className={cn("flex-1", micOn && "bg-success text-white hover:bg-success/90")}
                onClick={micOn ? stopListening : startListening}
                disabled={submitting || !support.recognition}
              >
                {micOn ? <MicOff className="mr-1.5 h-4 w-4" /> : <Mic className="mr-1.5 h-4 w-4" />}
                {micOn ? "Stop" : "Speak"}
              </Button>
              <Button variant="outline" size="icon"
                      onClick={() => (cameraOn ? closeCamera() : openCamera())}
                      aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}>
                {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
            </div>

            <Button className="w-full" onClick={submit} disabled={!liveText || submitting}>
              {submitting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          : <Send className="mr-1.5 h-4 w-4" />}
              {turn >= totalTurns ? "Finish interview" : "Submit & next"}
              {turn < totalTurns && <ArrowRight className="ml-1.5 h-4 w-4" />}
            </Button>

            <Button variant="ghost" size="sm" onClick={endNow} disabled={submitting}
                    className="w-full text-danger hover:bg-danger/10 hover:text-danger">
              <PhoneOff className="mr-1.5 h-4 w-4" />End interview
            </Button>

            <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
              Camera and mic stay on your device. Nothing is recorded.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

/**
 * Browser speech — the reason voice interviews cost nothing.
 *
 * Speech↔text happens entirely on the student's device, so the model only ever
 * sees text. A voice interview costs exactly the same as a typed one (~$0.004).
 * OpenAI's realtime audio API would be ~$0.40–0.50 for the same session.
 *
 * SUPPORT REALITY (AI_Intigration.md finding #5):
 *   SpeechSynthesis  — everywhere, including Firefox
 *   SpeechRecognition — Chrome / Edge / Safari only. FIREFOX HAS NEVER SHIPPED IT.
 * Lab machines also frequently have no working microphone. So the listening
 * half must always degrade to typing; the speaking half rarely needs to.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SpeechSupport {
  recognition: boolean
  synthesis: boolean
  secure: boolean
}

export function detectSpeechSupport(): SpeechSupport {
  if (typeof window === "undefined") {
    return { recognition: false, synthesis: false, secure: false }
  }
  const w = window as any
  const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition
  // getUserMedia and SpeechRecognition both require a secure context.
  const secure = window.isSecureContext || location.hostname === "localhost"
  return {
    recognition: !!SR && secure,
    synthesis: typeof window.speechSynthesis !== "undefined",
    secure,
  }
}

// ─── Speaking ────────────────────────────────────────────────────────────────

let cachedVoice: SpeechSynthesisVoice | null = null

/** Prefer an Indian English voice — it's what students expect to hear. */
function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice
  const voices = window.speechSynthesis?.getVoices?.() ?? []
  if (!voices.length) return null
  cachedVoice =
    voices.find((v) => v.lang === "en-IN") ??
    voices.find((v) => v.lang?.startsWith("en-IN")) ??
    voices.find((v) => v.lang?.startsWith("en-GB")) ??
    voices.find((v) => v.lang?.startsWith("en")) ??
    voices[0]
  return cachedVoice
}

export function speak(
  text: string,
  opts: { onStart?: () => void; onEnd?: () => void; onBoundary?: () => void } = {},
): () => void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    opts.onEnd?.()
    return () => {}
  }
  window.speechSynthesis.cancel()

  const utter = new SpeechSynthesisUtterance(text)
  const voice = pickVoice()
  if (voice) utter.voice = voice
  utter.lang = voice?.lang ?? "en-IN"
  utter.rate = 0.98          // a touch slower than default reads as considered
  utter.pitch = 1.0

  utter.onstart = () => opts.onStart?.()
  utter.onend = () => opts.onEnd?.()
  utter.onerror = () => opts.onEnd?.()
  if (opts.onBoundary) utter.onboundary = () => opts.onBoundary?.()

  // Chrome sometimes drops the queue if speak() fires too soon after cancel().
  setTimeout(() => window.speechSynthesis.speak(utter), 60)
  return () => window.speechSynthesis.cancel()
}

export function stopSpeaking() {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel()
}

/** Voices load asynchronously in Chrome; resolve once they're available. */
export function warmVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return resolve()
    if (window.speechSynthesis.getVoices().length) { pickVoice(); return resolve() }
    const handler = () => {
      pickVoice()
      window.speechSynthesis.removeEventListener("voiceschanged", handler)
      resolve()
    }
    window.speechSynthesis.addEventListener("voiceschanged", handler)
    setTimeout(resolve, 1200)
  })
}

// ─── Listening ───────────────────────────────────────────────────────────────

export type ListenErrorCode =
  | "no-speech" | "audio-capture" | "not-allowed" | "network" | "aborted" | "unknown"

export interface Listener {
  stop: () => void
  abort: () => void
}

/**
 * Continuous dictation with interim results.
 *
 * `continuous` still stops itself after a silence in most browsers, so we
 * restart it until the caller explicitly stops — otherwise a student pausing
 * to think silently ends their own answer.
 */
export function listen(opts: {
  onInterim?: (text: string) => void
  onFinal?: (text: string) => void
  onError?: (code: ListenErrorCode) => void
  onEnd?: () => void
}): Listener | null {
  const w = window as any
  const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition
  if (!SR) return null

  let stopped = false
  let finalText = ""
  const rec = new SR()
  rec.lang = "en-IN"
  rec.continuous = true
  rec.interimResults = true
  rec.maxAlternatives = 1

  rec.onresult = (e: any) => {
    let interim = ""
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const chunk = e.results[i][0].transcript
      if (e.results[i].isFinal) finalText += chunk + " "
      else interim += chunk
    }
    opts.onInterim?.((finalText + interim).trim())
  }

  rec.onerror = (e: any) => {
    const code: ListenErrorCode = e?.error ?? "unknown"
    // no-speech just means a quiet stretch; the restart below handles it.
    if (code !== "no-speech" && code !== "aborted") opts.onError?.(code)
  }

  rec.onend = () => {
    if (stopped) {
      opts.onFinal?.(finalText.trim())
      opts.onEnd?.()
      return
    }
    // Browser ended it on silence — keep the mic open until the student says stop.
    try { rec.start() } catch { opts.onEnd?.() }
  }

  try { rec.start() } catch { return null }

  return {
    stop: () => { stopped = true; try { rec.stop() } catch { /* already stopped */ } },
    abort: () => { stopped = true; try { rec.abort() } catch { /* already stopped */ } },
  }
}

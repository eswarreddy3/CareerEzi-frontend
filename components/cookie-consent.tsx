"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Script from "next/script"
import { Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"

// Analytics loads only after an explicit opt-in. Essential storage (auth,
// theme) does not need consent and is not gated here. The policy at /cookies
// lists every key — keep it in sync.

const CONSENT_KEY = "careerezi-cookie-consent"
const OPEN_EVENT = "careerezi:open-cookie-settings"
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

type Choice = "granted" | "denied"

function readChoice(): Choice | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const { choice, at } = JSON.parse(raw) as { choice: Choice; at: number }
    if (Date.now() - at > MAX_AGE_MS) return null // re-ask after 12 months
    return choice === "granted" || choice === "denied" ? choice : null
  } catch {
    return null
  }
}

function saveChoice(choice: Choice) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: Date.now() }))
  } catch {
    /* storage blocked — choice applies to this page view only */
  }
}

export function CookieConsent({ gaId }: { gaId?: string }) {
  const [choice, setChoice] = useState<Choice | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = readChoice()
    setChoice(saved)
    setOpen(saved === null)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  const decide = (c: Choice) => {
    saveChoice(c)
    setOpen(false)
    if (choice === "granted" && c === "denied") {
      // Scripts already running can't be unloaded — reload so GA is gone.
      window.location.reload()
      return
    }
    setChoice(c)
  }

  return (
    <>
      {gaId && choice === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {open && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie preferences"
          className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-4 sm:max-w-sm z-[60] glass-card rounded-2xl border border-border bg-popover shadow-2xl p-4 sm:p-5"
        >
          <div className="flex items-start gap-3 mb-4">
            <Cookie className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use essential cookies to keep you signed in. With your permission we also use Google Analytics
              to understand how the site is used. See our{" "}
              <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => decide("denied")}>Reject</Button>
            <Button className="flex-1" onClick={() => decide("granted")}>Accept analytics</Button>
          </div>
        </div>
      )}
    </>
  )
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="text-primary underline-offset-2 hover:underline"
    >
      Cookie settings
    </button>
  )
}

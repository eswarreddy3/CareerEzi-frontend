/**
 * Immersive layout — no sidebar, no top bar, no distractions.
 *
 * Separate from (dashboard) on purpose: the interview room opens in its own
 * tab and goes fullscreen, so any surrounding chrome would break the illusion
 * that you're sitting in front of an interviewer.
 *
 * Still authenticated — proxy.ts protects everything outside PUBLIC_ROUTES.
 */
export default function ImmersiveLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>
}

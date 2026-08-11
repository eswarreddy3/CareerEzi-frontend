import { create } from "zustand"
import { fetchCapabilities, type Capabilities, type PackKey } from "@/lib/ai"

/**
 * Saarthi capabilities, fetched once per session.
 *
 * Costs zero tokens and makes no external call, so it's safe to hit on every
 * dashboard mount. Nothing AI-related renders until this says the college is
 * licensed — an unlicensed college's students never learn the features exist.
 */
interface AIState {
  caps: Capabilities | null
  loading: boolean
  loadedAt: number
  load: (force?: boolean) => Promise<void>
  has: (pack: PackKey) => boolean
}

const STALE_MS = 5 * 60 * 1000

export const useAIStore = create<AIState>((set, get) => ({
  caps: null,
  loading: false,
  loadedAt: 0,

  load: async (force = false) => {
    const { loading, loadedAt } = get()
    if (loading) return
    if (!force && loadedAt && Date.now() - loadedAt < STALE_MS) return
    set({ loading: true })
    try {
      set({ caps: await fetchCapabilities(), loadedAt: Date.now() })
    } catch {
      // Fail closed — if we can't confirm access, render nothing.
      set({ caps: null })
    } finally {
      set({ loading: false })
    }
  },

  has: (pack) => !!get().caps?.features?.[pack]?.enabled,
}))

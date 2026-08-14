import { create } from "zustand"

interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void

  /** Saarthi's right-edge drawer. Shared state because the floating companion
   *  opens it and then hides itself so the two never overlap. */
  saarthiOpen: boolean
  setSaarthiOpen: (open: boolean) => void
  toggleSaarthi: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Always starts closed so the server and the first client render agree;
  // SaarthiPanel restores the persisted value after mount.
  saarthiOpen: false,
  setSaarthiOpen: (open) => set({ saarthiOpen: open }),
  toggleSaarthi: () => set((state) => ({ saarthiOpen: !state.saarthiOpen })),
}))

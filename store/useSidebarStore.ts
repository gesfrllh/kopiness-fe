import { create } from 'zustand'

interface SidebarStore {
  collapsed: boolean
  mobileOpen: boolean
  toggleCollapse: () => void
  setCollapsed: (collapsed: boolean) => void
  toggleMobile: () => void
  closeMobile: () => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: false,
  mobileOpen: false,
  toggleCollapse: () => set((state) => ({ collapsed: !state.collapsed })),
  setCollapsed: (collapsed) => set({ collapsed }),
  toggleMobile: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
  closeMobile: () => set({ mobileOpen: false }),
}))

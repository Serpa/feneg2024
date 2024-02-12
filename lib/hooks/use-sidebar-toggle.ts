import { create } from "zustand"
interface SideBarToggle {
    toggleCollapse: boolean,
    invokeToggleCollapse: () => void
}

export const useSideBarToggle = create<SideBarToggle>((set, get) => ({
    toggleCollapse: false,
    invokeToggleCollapse: () => set({ toggleCollapse: !get().toggleCollapse })
}))
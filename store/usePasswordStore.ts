import {create} from 'zustand'

interface PasswordStore {
    visibilityMap: Record<string, boolean>
    toggleVisibility: (field: string) => void;
    isVisible: (field: string) => boolean;
}

export const usePasswordStore = create<PasswordStore>((set, get) => ({
    visibilityMap: {},
    toggleVisibility: (field: string) => 
        set((state) => ({
            visibilityMap: {
                ...state.visibilityMap,
                [field]: !state.visibilityMap[field],
            },
        })),
    isVisible: (field: string) => !!get().visibilityMap[field]
}))
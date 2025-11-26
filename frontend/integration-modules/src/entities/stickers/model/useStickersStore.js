import { create } from 'zustand'

/**
 * Zustand store для управления стикерами.
 * Каждый стикер:
 * { id, x, y, width, height, color, text, zIndex }
 *
 * Теперь есть topZ — инкрементируемое значение для корректного наложения.
 */

let idCounter = 1
const nextId = () => String(idCounter++)

export const useStickersStore = create((set, get) => ({
    stickers: [],
    draggingId: null,
    topZ: 1, // текущее значение z-index для верхнего элемента

    addSticker: (opts = {}) => {
        const {
            x = 200,
            y = 100,
            color = '#FFD966',
            width = 160,
            height = 160,
            text = '',
            zIndex
        } = opts

        const z = typeof zIndex === 'number' ? zIndex : get().topZ + 1

        const s = {
            id: nextId(),
            x,
            y,
            width,
            height,
            color,
            text,
            zIndex: z
        }

        set(state => ({
            stickers: [...state.stickers, s],
            topZ: Math.max(state.topZ, z)
        }))

        return s.id
    },

    updateSticker: (id, patch) => {
        set(state => ({
            stickers: state.stickers.map(s => (s.id === id ? { ...s, ...patch } : s))
        }))
    },

    removeSticker: (id) => {
        set(state => ({ stickers: state.stickers.filter(s => s.id !== id) }))
    },

    setPosition: (id, x, y) => {
        get().updateSticker(id, { x, y })
    },

    setSize: (id, width, height) => {
        get().updateSticker(id, { width, height })
    },

    bringToFront: (id) => {
        const newZ = get().topZ + 1
        get().updateSticker(id, { zIndex: newZ })
        set({ topZ: newZ })
    },

    setText: (id, text) => {
        get().updateSticker(id, { text })
    },

    startDragging: (id) => set({ draggingId: id }),
    stopDragging: () => set({ draggingId: null }),

    // Сброс состояния (только для теста)
    reset: () => set({ stickers: [], topZ: 1 })
}))
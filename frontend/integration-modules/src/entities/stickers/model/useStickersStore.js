import { create } from 'zustand'

export const useStickersStore = create((set) => ({
    stickers: [],
    topZ: 1,

    addSticker: (payload) => {
        set((state) => {
            const id = payload && payload.id ? String(payload.id) : crypto.randomUUID()
            const zIndex = payload && payload.zIndex ? payload.zIndex : (state.topZ || 1) + 1

            const sticker = {
                id,
                x: payload.x,
                y: payload.y,
                color: payload.color,
                width: payload.width,
                height: payload.height,
                text: payload.text ?? '',
                zIndex
            }

            return {
                stickers: [...state.stickers, sticker],
                topZ: Math.max(state.topZ || 1, zIndex)
            }
        })
    },

    setStickers: (stickers) => {
        set(() => ({
            stickers,
            topZ: stickers.reduce((acc, x) => Math.max(acc, x.zIndex || 1), 1)
        }))
    },

    reset: () => {
        set({
            stickers: [],
            topZ: 1
        })
    },

    setPosition: (id, x, y) => {
        set((state) => ({
            stickers: state.stickers.map((s) => {
                if (s.id === id) {
                    return { ...s, x, y }
                }

                return s
            })
        }))
    },

    setSize: (id, width, height) => {
        set((state) => ({
            stickers: state.stickers.map((s) => {
                if (s.id === id) {
                    return { ...s, width, height }
                }

                return s
            })
        }))
    },

    setText: (id, text) => {
        set((state) => ({
            stickers: state.stickers.map((s) => {
                if (s.id === id) {
                    return { ...s, text }
                }

                return s
            })
        }))
    },

    bringToFront: (id) => {
        set((state) => {
            const nextZ = (state.topZ || 1) + 1

            return {
                stickers: state.stickers.map((s) => {
                    if (s.id === id) {
                        return { ...s, zIndex: nextZ }
                    }

                    return s
                }),
                topZ: nextZ
            }
        })
    },

    removeSticker: (id) => {
        set((state) => ({
            stickers: state.stickers.filter((s) => s.id !== id)
        }))
    }
}))

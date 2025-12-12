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
                width: payload.width,
                height: payload.height,
                color: payload.color,
                text: payload.text ?? '',
                zIndex,
                rotation: payload.rotation ?? 0,
                type: payload.type,
                shapeId: payload.shapeId,
                shapeData: payload.shapeData,
                imageUrl: payload.imageUrl
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
            topZ: stickers.reduce((acc, x) => Math.max(acc, x.zIndex ?? 1), 1)
        }))
    },

    reset: () => {
        set({
            stickers: [],
            topZ: 1
        })
    },

    updateSticker: (id, patch) => {
        set((state) => ({
            stickers: state.stickers.map((s) =>
                s.id === id ? { ...s, ...patch } : s
            )
        }))
    },

    setPosition: (id, x, y) => {
        set((state) => ({
            stickers: state.stickers.map((s) =>
                s.id === id ? { ...s, x, y } : s
            )
        }))
    },

    setSize: (id, width, height) => {
        set((state) => ({
            stickers: state.stickers.map((s) =>
                s.id === id ? { ...s, width, height } : s
            )
        }))
    },

    setText: (id, text) => {
        set((state) => ({
            stickers: state.stickers.map((s) =>
                s.id === id ? { ...s, text } : s
            )
        }))
    },

    bringToFront: (id) => set(state => {
        const sticker = state.stickers.find(s => s.id === id);
        if (!sticker) return state;
        const newZ = (state.topZ || 1) + 1;
        return {
            stickers: state.stickers.map(s => s.id === id ? { ...s, zIndex: newZ } : s),
            topZ: newZ
        }
    }),

    removeSticker: (id) => {
        set((state) => {
            const filtered = state.stickers.filter((s) => s.id !== id)
            return {
                stickers: filtered,
                topZ: filtered.reduce((acc, x) => Math.max(acc, x.zIndex ?? 1), 1)
            }
        })
    },
    selectSticker: (id) => set({ selectedId: id }),
    selectedId: null,

}))

import { create } from 'zustand'

export const useStickersStore = create((set, get) => ({
    stickers: [],
    edges: [],
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
                deadline: payload.deadline,
                completed: payload.completed ?? false,
                cancelled: payload.cancelled ?? false,

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
    addRoadmapBranch: (parentId) => {
        const state = get()
        const parent = state.stickers.find(s => s.id === parentId)
        if (!parent) return

        const children = state.stickers.filter(s =>
            state.edges.some(e => e.source === parentId && e.target === s.id)
        )

        const childId = crypto.randomUUID()

        const NODE_WIDTH = 200
        const NODE_HEIGHT = 100
        const HORIZONTAL_OFFSET = NODE_WIDTH + 140
        const VERTICAL_GAP = 50


        const newX = parent.x + HORIZONTAL_OFFSET

        let newY
        if (children.length === 0) {
            newY = parent.y + (parent.height || NODE_HEIGHT) / 2 - NODE_HEIGHT / 2 + VERTICAL_GAP
        } else {
            const lowestChild = children.reduce((lowest, child) =>
                child.y + (child.height || NODE_HEIGHT) > lowest.y + (lowest.height || NODE_HEIGHT) ? child : lowest
            )
            newY = lowestChild.y + (lowestChild.height || NODE_HEIGHT) + VERTICAL_GAP
        }

        state.addSticker({
            id: childId,
            type: 'roadmap',
            x: newX,
            y: newY,
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
            text: '',
            completed: false,
            cancelled: false,
            deadline: null,
            zIndex: (state.topZ || 1) + 1,
        })

        set((state) => ({
            edges: [
                ...state.edges,
                {
                    id: `e-${parentId}-${childId}`,
                    source: parentId,
                    target: childId,
                    type: 'bezier',
                    animated: false,
                }
            ]
        }))
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
                edges: state.edges.filter(e => e.source !== id && e.target !== id),
                topZ: filtered.reduce((acc, x) => Math.max(acc, x.zIndex ?? 1), 1)
            }
        })
    },
    selectSticker: (id) => set({ selectedId: id }),
    selectedId: null,

}))

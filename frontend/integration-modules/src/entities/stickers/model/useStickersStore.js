import { create } from 'zustand'
import { roadmapApi } from '../../../shared/api/roadmapApi.js'

export const useStickersStore = create((set, get) => ({
    stickers: [],
    edges: [],
    topZ: 1,
    selectedId: null,

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
                description: payload.description ?? '',
                date: payload.date ?? null,
                completed: payload.completed ?? false,
                cancelled: payload.cancelled ?? false,
                parentId: payload.parentId ?? null,

                zIndex,
                rotation: payload.rotation ?? 0,
                type: payload.type,
                shapeId: payload.shapeId,
                shapeData: payload.shapeData,
                imageUrl: payload.imageUrl,
                info: payload.info ?? null
            }

            return {
                stickers: [...state.stickers, sticker],
                topZ: Math.max(state.topZ || 1, zIndex)
            }
        })
    },

    addRoadmapBranch: async (parentId) => {
        const state = get()
        const parent = state.stickers.find(s => String(s.id) === String(parentId))
        if (!parent) {
            return
        }

        const children = state.stickers.filter(s =>
            state.edges.some(e => String(e.source) === String(parentId) && String(e.target) === String(s.id))
        )

        const NODE_WIDTH = 200
        const NODE_HEIGHT = 120
        const HORIZONTAL_OFFSET = NODE_WIDTH + 140
        const VERTICAL_GAP = 50

        const newX = (parent.x ?? 0) + HORIZONTAL_OFFSET

        let newY
        if (children.length === 0) {
            newY = (parent.y ?? 0) + ((parent.height || NODE_HEIGHT) / 2) - (NODE_HEIGHT / 2) + VERTICAL_GAP
        } else {
            const lowestChild = children.reduce((lowest, child) => {
                const lowestBottom = (lowest.y ?? 0) + (lowest.height || NODE_HEIGHT)
                const childBottom = (child.y ?? 0) + (child.height || NODE_HEIGHT)
                if (childBottom > lowestBottom) {
                    return child
                }
                return lowest
            })
            newY = (lowestChild.y ?? 0) + (lowestChild.height || NODE_HEIGHT) + VERTICAL_GAP
        }

        const nextZ = (state.topZ || 1) + 1

        let created
        try {
            created = await roadmapApi.create({
                text: '',
                description: '',
                date: null,
                completed: false,
                cancelled: false,
                zIndex: nextZ,
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                parentId: String(parentId)
            })
        } catch (e) {
            console.warn('Не удалось создать roadmap ветку', e)
            return
        }

        const childId = String(created.id)

        state.addSticker({
            id: childId,
            type: 'roadmap',
            x: newX,
            y: newY,
            width: created.width ?? NODE_WIDTH,
            height: created.height ?? NODE_HEIGHT,
            text: created.text ?? '',
            description: created.description ?? '',
            date: created.date ?? null,
            completed: created.completed ?? false,
            cancelled: created.cancelled ?? false,
            parentId: created.parentId ?? String(parentId),
            zIndex: created.zIndex ?? nextZ
        })

        set((prev) => ({
            edges: [
                ...prev.edges,
                {
                    id: `e-${parentId}-${childId}`,
                    source: String(parentId),
                    target: childId,
                    type: 'default',
                    animated: false
                }
            ],
            topZ: Math.max(prev.topZ || 1, nextZ)
        }))
    },

    setStickers: (stickers) => {
        set(() => ({
            stickers,
            topZ: stickers.reduce((acc, x) => Math.max(acc, x.zIndex ?? 1), 1)
        }))
    },

    setEdges: (edges) => {
        set(() => ({
            edges
        }))
    },

    reset: () => {
        set({
            stickers: [],
            edges: [],
            topZ: 1,
            selectedId: null
        })
    },

    updateSticker: (id, patch) => {
        set((state) => ({
            stickers: state.stickers.map((s) =>
                String(s.id) === String(id) ? { ...s, ...patch } : s
            )
        }))
    },

    setPosition: (id, x, y) => {
        set((state) => ({
            stickers: state.stickers.map((s) =>
                String(s.id) === String(id) ? { ...s, x, y } : s
            )
        }))
    },

    setSize: (id, width, height) => {
        set((state) => ({
            stickers: state.stickers.map((s) =>
                String(s.id) === String(id) ? { ...s, width, height } : s
            )
        }))
    },

    setText: (id, text) => {
        set((state) => ({
            stickers: state.stickers.map((s) =>
                String(s.id) === String(id) ? { ...s, text } : s
            )
        }))
    },

    bringToFront: (id) => {
        set((state) => {
            const sticker = state.stickers.find(s => String(s.id) === String(id))
            if (!sticker) {
                return state
            }

            const newZ = (state.topZ || 1) + 1

            return {
                stickers: state.stickers.map(s => String(s.id) === String(id) ? { ...s, zIndex: newZ } : s),
                topZ: newZ
            }
        })
    },

    removeSticker: (id) => {
        set((state) => {
            const filtered = state.stickers.filter((s) => String(s.id) !== String(id))

            return {
                stickers: filtered,
                edges: state.edges.filter(e => String(e.source) !== String(id) && String(e.target) !== String(id)),
                topZ: filtered.reduce((acc, x) => Math.max(acc, x.zIndex ?? 1), 1)
            }
        })
    },

    selectSticker: (id) => {
        set({ selectedId: id })
    },
    getDescendants: (parentId) => {
        const { stickers } = get()
        const result = []

        const walk = (id) => {
            const children = stickers.filter(
                s => String(s.parentId) === String(id)
            )

            for (const child of children) {
                result.push(child)
                walk(child.id)
            }
        }

        walk(parentId)
        return result
    },
    removeStickersBulk: (ids) => {
        set((state) => {
            const idSet = new Set(ids.map(String))

            const filteredStickers = state.stickers.filter(
                s => !idSet.has(String(s.id))
            )

            return {
                stickers: filteredStickers,
                edges: state.edges.filter(
                    e =>
                        !idSet.has(String(e.source)) &&
                        !idSet.has(String(e.target))
                ),
                topZ: filteredStickers.reduce(
                    (acc, x) => Math.max(acc, x.zIndex ?? 1),
                    1
                )
            }
        })
    },
    detachChildren: (parentId) => {
        set((state) => ({
            stickers: state.stickers.map(s =>
                String(s.parentId) === String(parentId)
                    ? { ...s, parentId: null }
                    : s
            )
        }))
    },
}))

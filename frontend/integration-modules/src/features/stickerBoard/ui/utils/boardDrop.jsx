import { stickersApi } from '../../../../shared/api/stickerApi.js'
import { notesApi } from '../../../../shared/api/notesApi.js'

const EMOJI_W = 91
const EMOJI_H = 84
const NOTE_W = 160
const NOTE_H = 160
const BOARD_SAFE_PAD = 10

const DND_EMOJI = 'application/x-integration-emoji'
const DND_NOTE = 'application/x-integration-note'

export function hasType(dt, type) {
    if (!dt || !dt.types) return false
    return Array.from(dt.types).includes(type)
}

export function tryParseJson(raw) {
    try {
        return JSON.parse(raw)
    } catch (e) {
        return null
    }
}

export function createOnDragOver() {
    return (e) => {
        const dt = e.dataTransfer
        if (!hasType(dt, DND_EMOJI) && !hasType(dt, DND_NOTE)) return
        e.preventDefault()
    }
}

export function createOnDrop({ boardRef, addSticker, topZ }) {
    return async (e) => {
        const board = boardRef.current
        if (!board) return

        const dt = e.dataTransfer
        if (!dt) return

        const rawEmoji = dt.getData(DND_EMOJI)
        const rawNote = dt.getData(DND_NOTE)

        if (!rawEmoji && !rawNote) return

        e.preventDefault()
        e.stopPropagation()

        const rect = board.getBoundingClientRect()
        const scrollLeft = board.scrollLeft || 0
        const scrollTop = board.scrollTop || 0

        if (rawEmoji) {
            const payload = tryParseJson(rawEmoji)
            if (!payload || !payload.id) return

            const width = EMOJI_W
            const height = EMOJI_H
            const x = Math.max(0, Math.round(scrollLeft + (e.clientX - rect.left) - BOARD_SAFE_PAD - width / 2))
            const y = Math.max(0, Math.round(scrollTop + (e.clientY - rect.top) - BOARD_SAFE_PAD - height / 2))
            const nextZ = (topZ || 1) + 1

            try {
                const saved = await stickersApi.addToBoard(payload.id)
                addSticker({
                    id: saved.id,
                    x,
                    y,
                    color: 'transparent',
                    width,
                    height,
                    text: '',
                    zIndex: nextZ,
                    imageUrl: saved.url
                })
            } catch (err) {
                console.warn('Не удалось сохранить эмодзи на доске:', err)
                addSticker({
                    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                    x,
                    y,
                    color: 'transparent',
                    width,
                    height,
                    text: '',
                    zIndex: nextZ,
                    imageUrl: payload.url
                })
            }

            return
        }

        const notePayload = tryParseJson(rawNote)
        const color = notePayload?.color
        if (!color) return

        const width = NOTE_W
        const height = NOTE_H
        const x = Math.max(0, Math.round(scrollLeft + (e.clientX - rect.left) - BOARD_SAFE_PAD - width / 2))
        const y = Math.max(0, Math.round(scrollTop + (e.clientY - rect.top) - BOARD_SAFE_PAD - height / 2))
        const nextZ = (topZ || 1) + 1

        try {
            const created = await notesApi.create(color)
            addSticker({
                id: created.id,
                x,
                y,
                color,
                width,
                height,
                text: created.content ?? '',
                zIndex: nextZ
            })
        } catch (err) {
            console.warn('Не удалось создать заметку:', err)
        }
    }
}

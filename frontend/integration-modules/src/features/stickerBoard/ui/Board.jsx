import React, { forwardRef, useImperativeHandle, useRef, createContext } from 'react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { Sticker } from './Sticker'
import { notesApi } from '../../../shared/api/notesApi'
import { stickersApi } from '../../../shared/api/stickerApi'

export const BoardContext = createContext(null)

const EMOJI_W = 91
const EMOJI_H = 84
const NOTE_W = 160
const NOTE_H = 160
const BOARD_SAFE_PAD = 10

const DND_EMOJI = 'application/x-integration-emoji'
const DND_NOTE = 'application/x-integration-note'

function hasType(dt, type) {
    if (!dt || !dt.types) {
        return false
    }

    return Array.from(dt.types).includes(type)
}

function tryParseJson(raw) {
    try {
        return JSON.parse(raw)
    } catch (e) {
        return null
    }
}

export const Board = forwardRef(function Board(_, ref) {
    const boardRef = useRef(null)
    const stickers = useStickersStore((state) => state.stickers)
    const addSticker = useStickersStore((state) => state.addSticker)
    const topZ = useStickersStore((state) => state.topZ)

    useImperativeHandle(ref, () => ({
        addStickerAtCenter: (color = '#FFF9C4', opts = {}) => {
            const board = boardRef.current
            const defaultW = opts.width ?? NOTE_W
            const defaultH = opts.height ?? NOTE_H
            const overlap = opts.overlap !== undefined ? opts.overlap : true
            const stagger = !!opts.stagger

            let x
            let y

            if (!board) {
                x = 260
                y = 120
            } else {
                const visibleW = board.clientWidth
                const visibleH = board.clientHeight
                const scrollLeft = board.scrollLeft || 0
                const scrollTop = board.scrollTop || 0

                const contentW = Math.max(0, visibleW - BOARD_SAFE_PAD * 2)
                const contentH = Math.max(0, visibleH - BOARD_SAFE_PAD * 2)

                x = Math.max(0, Math.round(scrollLeft + contentW / 2 - defaultW / 2))
                y = Math.max(0, Math.round(scrollTop + contentH / 2 - defaultH / 2))
            }

            if (!overlap && stagger) {
                const count = stickers.length || 0
                const offset = Math.min(24, count * 18)
                x += offset
                y += offset
            } else if (stagger && overlap) {
                const count = stickers.length || 0
                const offset = (count % 6) * 6
                x += offset
                y += offset
            }

            const nextZ = (topZ || 1) + 1

            addSticker({
                id: opts.id,
                x,
                y,
                color,
                width: defaultW,
                height: defaultH,
                text: opts.text ?? '',
                zIndex: nextZ
            })
        }
    }), [addSticker, stickers, topZ])

    const onDragOver = (e) => {
        const dt = e.dataTransfer
        if (!hasType(dt, DND_EMOJI) && !hasType(dt, DND_NOTE)) {
            return
        }

        e.preventDefault()
    }

    const onDrop = async (e) => {
        const board = boardRef.current
        if (!board) {
            return
        }

        const dt = e.dataTransfer
        if (!dt) {
            return
        }

        const rawEmoji = dt.getData(DND_EMOJI)
        const rawNote = dt.getData(DND_NOTE)

        if (!rawEmoji && !rawNote) {
            return
        }

        e.preventDefault()
        e.stopPropagation()

        const rect = board.getBoundingClientRect()
        const scrollLeft = board.scrollLeft || 0
        const scrollTop = board.scrollTop || 0

        // ===== emoji drop =====
        if (rawEmoji) {
            const payload = tryParseJson(rawEmoji)
            if (!payload || !payload.id) {
                return
            }

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
        if (!color) {
            return
        }

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

    return (
        <BoardContext.Provider value={boardRef}>
            <div
                ref={boardRef}
                data-board="true"
                className="flex-1 relative bg-white m-4 rounded shadow-sm overflow-auto"
                style={{ minHeight: 200, padding: BOARD_SAFE_PAD }}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                {stickers.map((s) => (
                    <Sticker key={s.id} id={s.id} />
                ))}
            </div>
        </BoardContext.Provider>
    )
})
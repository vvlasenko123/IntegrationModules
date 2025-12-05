import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { createContext } from 'react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { useDropHandler } from '../hooks/useDropHandler'
import { NoteSticker } from '../../note/ui/NoteSticker.jsx'
import { EmojiSticker } from '../../emoji-sticker/ui/EmojiSticker.jsx'
import { BoardContext } from './BoardContext.jsx'
import { BOARD_SAFE_PAD, NOTE_W, NOTE_H, DND_EMOJI, DND_NOTE, DND_SHAPE } from '../constants'
import { ShapeSticker } from '../../shape/ui/ShapeSticker.jsx'

export const Board = forwardRef((_, ref) => {
    const boardRef = useRef(null)
    const stickers = useStickersStore((s) => s.stickers)
    const addSticker = useStickersStore((s) => s.addSticker)
    const topZ = useStickersStore((s) => s.topZ)

    const handleDrop = useDropHandler(boardRef)

    useImperativeHandle(ref, () => ({
        addStickerAtCenter: (color = '#FFF9C4', opts = {}) => {
            const board = boardRef.current
            if (!board) {
                addSticker({ x: 260, y: 120, color, width: NOTE_W, height: NOTE_H, text: opts.text ?? '', zIndex: (topZ || 1) + 1 })
                return
            }

            const { clientWidth, clientHeight, scrollLeft, scrollTop } = board
            const x = Math.round(scrollLeft + clientWidth / 2 - (opts.width ?? NOTE_W) / 2)
            const y = Math.round(scrollTop + clientHeight / 2 - (opts.height ?? NOTE_H) / 2)

            addSticker({
                id: opts.id,
                x,
                y,
                color,
                width: opts.width ?? NOTE_W,
                height: opts.height ?? NOTE_H,
                text: opts.text ?? '',
                zIndex: (topZ || 1) + 1,
            })
        },
    }), [addSticker, topZ])

    const onDragOver = (e) => {
        if (e.dataTransfer.types.some(t => [DND_NOTE, DND_EMOJI, DND_SHAPE].includes(t))) {
            e.preventDefault()
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
                onDrop={handleDrop}
            >
                {stickers.map((s) => {
                    if (s.imageUrl) return <EmojiSticker key={s.id} id={s.id} />
                    if (s.type === 'shape') return <ShapeSticker key={s.id} id={s.id} />
                    return <NoteSticker key={s.id} id={s.id} />
                })}
            </div>
        </BoardContext.Provider>
    )
})
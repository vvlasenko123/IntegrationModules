import React, { forwardRef, useRef, useImperativeHandle, createContext } from 'react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { Sticker } from './Sticker'
import { createOnDragOver, createOnDrop } from './utils/boardDrop.jsx'

export const BoardContext = createContext(null)

const EMOJI_W = 91
const EMOJI_H = 84
const NOTE_W = 160
const NOTE_H = 160
const BOARD_SAFE_PAD = 10

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

    const onDragOver = createOnDragOver()
    const onDrop = createOnDrop({ boardRef, addSticker, topZ })

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

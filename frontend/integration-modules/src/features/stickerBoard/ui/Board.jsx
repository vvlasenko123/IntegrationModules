import React, { forwardRef, useImperativeHandle, useRef, createContext } from 'react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { Sticker } from './Sticker'

/**
 * Board + BoardContext
 * - предоставляем boardRef через контекст, чтобы Sticker всегда ссылался на один и тот же контейнер
 * - addStickerAtCenter использует clientWidth/clientHeight + scrollLeft/Top, НЕ использует scrollHeight/scrollWidth для clamp
 */

export const BoardContext = createContext(null)

export const Board = forwardRef(function Board(_, ref) {
    const boardRef = useRef(null)
    const stickers = useStickersStore(state => state.stickers)
    const addSticker = useStickersStore(state => state.addSticker)
    const topZ = useStickersStore(state => state.topZ)

    useImperativeHandle(ref, () => ({
        addStickerAtCenter: (color = '#FFF9C4', opts = {}) => {
            const board = boardRef.current
            const defaultW = opts.width ?? 160
            const defaultH = opts.height ?? 160
            const overlap = opts.overlap !== undefined ? opts.overlap : true
            const stagger = !!opts.stagger

            let x, y

            if (!board) {
                x = 260
                y = 120
            } else {
                // используем clientWidth/clientHeight и видимую прокрутку
                const visibleW = board.clientWidth
                const visibleH = board.clientHeight
                const scrollLeft = board.scrollLeft || 0
                const scrollTop = board.scrollTop || 0

                x = Math.max(0, Math.round(scrollLeft + visibleW / 2 - defaultW / 2))
                y = Math.max(0, Math.round(scrollTop + visibleH / 2 - defaultH / 2))
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
            addSticker({ x, y, color, width: defaultW, height: defaultH, text: opts.text ?? '', zIndex: nextZ })
        }
    }), [addSticker, stickers, topZ])

    return (
        <BoardContext.Provider value={boardRef}>
            <div
                ref={boardRef}
                data-board="true"
                className="flex-1 relative bg-white m-4 rounded shadow-sm overflow-auto"
                style={{ minHeight: 200 }}
            >
                {stickers.map(s => (
                    <Sticker key={s.id} id={s.id} />
                ))}
            </div>
        </BoardContext.Provider>
    )
})
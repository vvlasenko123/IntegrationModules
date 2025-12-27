import React from 'react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'

export function useBoardApi(ref, boardRef) {
    const addSticker = useStickersStore(s => s.addSticker)
    const topZ = useStickersStore(s => s.topZ)

    React.useImperativeHandle(ref, () => ({
        addStickerAtCenter: (color = '#FFF9C4', opts = {}) => {
            const board = boardRef.current
            const width = opts.width ?? 160
            const height = opts.height ?? 160
            const x = board
                ? Math.round(board.scrollLeft + board.clientWidth / 2 - width / 2)
                : 260
            const y = board
                ? Math.round(board.scrollTop + board.clientHeight / 2 - height / 2)
                : 120

            addSticker({
                id: opts.id,
                x,
                y,
                width,
                height,
                text: opts.text ?? '',
                color,
                zIndex: (topZ || 1) + 1
            })
        }
    }), [boardRef, addSticker, topZ])
}

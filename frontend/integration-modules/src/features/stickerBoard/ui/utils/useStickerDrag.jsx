// hooks/useStickerDrag.js
import { useRef, useContext } from 'react'
import { BoardContext } from '../Board.jsx'

export const useStickerDrag = (id, sticker, setPosition, bringToFront) => {
    const boardRef = useContext(BoardContext)
    const dragRef = useRef({
        dragging: false,
        pointerId: null,
        startClientX: 0,
        startClientY: 0,
        startStickerX: 0,
        startStickerY: 0,
        scale: 1
    })

    const onRootPointerDown = (e, contentRef, isImage) => {
        if (e.button !== 0) {
            return
        }

        if (!isImage) {
            if (contentRef.current && contentRef.current.contains(e.target)) {
                return
            }
        }

        e.preventDefault()
        e.stopPropagation()
        bringToFront(id)

        const el = e.currentTarget
        if (!el) {
            return
        }

        const board = (boardRef && boardRef.current) ? boardRef.current : (el.closest ? el.closest('[data-board="true"]') : null)
        const boardRect = board ? board.getBoundingClientRect() : el.getBoundingClientRect()
        const clientWidth = board ? (board.clientWidth || boardRect.width) : boardRect.width
        const scale = clientWidth ? (boardRect.width / clientWidth) : 1

        dragRef.current.dragging = true
        dragRef.current.pointerId = e.pointerId
        dragRef.current.startClientX = e.clientX
        dragRef.current.startClientY = e.clientY
        dragRef.current.startStickerX = sticker.x
        dragRef.current.startStickerY = sticker.y
        dragRef.current.scale = scale || 1

        try {
            if (el.setPointerCapture) {
                el.setPointerCapture(e.pointerId)
            }
        } catch (err) { }
    }

    return { dragRef, onRootPointerDown }
}
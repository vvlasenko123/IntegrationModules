import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { useDropHandler } from '../hooks/useDropHandler'
import { NoteSticker } from '../../note/ui/NoteSticker.jsx'
import { EmojiSticker } from '../../emoji-sticker/ui/EmojiSticker.jsx'
import { ShapeSticker } from '../../shape/ui/ShapeSticker.jsx'
import { CodeBlock } from '../../code-block/ui/CodeBlock.jsx'
import { BoardContext } from './BoardContext.jsx'
import { BOARD_SAFE_PAD, NOTE_W, NOTE_H, DND_EMOJI, DND_NOTE, DND_SHAPE, DND_CODE } from '../constants'

export const Board = forwardRef((_, ref) => {
    const boardRef = useRef(null)
    const [boardSize, setBoardSize] = useState({ width: 1000, height: 1000 })
    const stickers = useStickersStore(s => s.stickers)
    const addSticker = useStickersStore(s => s.addSticker)
    const topZ = useStickersStore(s => s.topZ)
    const selectedId = useStickersStore(s => s.selectedId)
    const select = useStickersStore(s => s.selectSticker);
    const [draggingShapeId, setDraggingShapeId] = useState(null)
    const [hoverShapeId, setHoverShapeId] = useState(null)
    const [transformingShapeId, setTransformingShapeId] = useState(null)
    const handleDrop = useDropHandler(boardRef)

    // Drag / Transform events
    useEffect(() => {
        const onStart = e => setDraggingShapeId(e?.detail?.id ?? null)
        const onEnd = () => setDraggingShapeId(null)
        window.addEventListener('shape-drag-start', onStart)
        window.addEventListener('shape-drag-end', onEnd)
        return () => {
            window.removeEventListener('shape-drag-start', onStart)
            window.removeEventListener('shape-drag-end', onEnd)
        }
    }, [])
    const handleBoardPointerDown = (e) => {
        const el = e.target;

        // Если клик по DOM стикеру → не снимаем выделение
        if (isInsideDomSticker(el)) return;

        // Если клик по форме (svg внутри Rnd) — не снимаем
        if (el.closest('.shape-sticker-container')) return;

        // Клик в пустую зону — снять выделение
        select(null);
    };
    useEffect(() => {
        const onTransformStart = e => setTransformingShapeId(e?.detail?.id ?? null)
        const onTransformEnd = () => setTransformingShapeId(null)
        window.addEventListener('shape-transform-start', onTransformStart)
        window.addEventListener('shape-transform-end', onTransformEnd)
        return () => {
            window.removeEventListener('shape-transform-start', onTransformStart)
            window.removeEventListener('shape-transform-end', onTransformEnd)
        }
    }, [])

    // Resize observer
    useEffect(() => {
        if (!boardRef.current) return
        const el = boardRef.current
        const ro = new ResizeObserver(() => {
            const { clientWidth, clientHeight } = el
            setBoardSize({ width: clientWidth, height: clientHeight })
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Add sticker at center
    useImperativeHandle(ref, () => ({
        addStickerAtCenter: (color = '#FFF9C4', opts = {}) => {
            const board = boardRef.current
            const { clientWidth, clientHeight, scrollLeft, scrollTop } = board || {}
            const x = board ? Math.round(scrollLeft + clientWidth / 2 - (opts.width ?? NOTE_W) / 2) : 260
            const y = board ? Math.round(scrollTop + clientHeight / 2 - (opts.height ?? NOTE_H) / 2) : 120
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
        }
    }), [addSticker, topZ])

    const onDragOver = e => {
        if (e.dataTransfer.types.some(t => [DND_NOTE, DND_EMOJI, DND_SHAPE, DND_CODE].includes(t))) {
            e.preventDefault()
        }
    }

    const isInsideDomSticker = el => {
        while (el) {
            if (el.dataset && ['note','emoji'].includes(el.dataset.stickerType)) return true
            if (el.classList && ['sticker-root','emoji-item','emoji-img','sticker-context-menu','sticker-drag-header'].some(c => el.classList.contains(c))) return true
            el = el.parentElement
        }
        return false
    }

    const findShapeUnderPoint = (px, py, shapeStickers) => {
        const byTop = shapeStickers.slice().sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
        for (const s of byTop) {
            const { x: sx = 0, y: sy = 0, width: sw = 0, height: sh = 0 } = s
            if (px >= sx && px <= sx + sw && py >= sy && py <= sy + sh) return s.id
        }
        return null
    }

    const onBoardPointerMove = e => {
        const boardElem = boardRef.current
        if (!boardElem) { setHoverShapeId(null); return }

        if (transformingShapeId) { setHoverShapeId(transformingShapeId); return }

        const topEl = document.elementFromPoint(e.clientX, e.clientY)
        if (topEl && isInsideDomSticker(topEl)) { setHoverShapeId(null); return }

        const boardRect = boardElem.getBoundingClientRect()
        const px = Math.round(boardElem.scrollLeft + e.clientX - boardRect.left)
        const py = Math.round(boardElem.scrollTop + e.clientY - boardRect.top)

        const shapeStickers = stickers.filter(s => s.type === 'shape')
        const candidateId = findShapeUnderPoint(px, py, shapeStickers)
        setHoverShapeId(candidateId)
    }

    const onBoardPointerLeave = () => setHoverShapeId(null)

    return (
        <BoardContext.Provider value={boardRef}>
            <div
                ref={boardRef}
                data-board="true"
                className="flex-1 relative bg-white m-4 rounded shadow-sm overflow-auto"
                style={{ minHeight: 200, padding: BOARD_SAFE_PAD }}
                onDragOver={onDragOver}
                onDrop={handleDrop}
                onPointerDown={handleBoardPointerDown}
                onPointerMove={onBoardPointerMove}
                onPointerLeave={onBoardPointerLeave}
            >
                {stickers.map(s => {
                    if (s.type === 'shape') return <ShapeSticker key={s.id} id={s.id} />
                    if (s.type === 'code') return <CodeBlock key={s.id} id={s.id} />
                    if (s.imageUrl) return <EmojiSticker key={s.id} id={s.id} />
                    return <NoteSticker key={s.id} id={s.id} />
                })}
            </div>
        </BoardContext.Provider>
    )
})

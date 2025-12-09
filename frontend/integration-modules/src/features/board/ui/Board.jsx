import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { useDropHandler } from '../hooks/useDropHandler'
import { NoteSticker } from '../../note/ui/NoteSticker.jsx'

import { EmojiSticker } from '../../emoji-sticker/ui/EmojiSticker.jsx'
import { BoardContext } from './BoardContext.jsx'
import { BOARD_SAFE_PAD, NOTE_W, NOTE_H, DND_EMOJI, DND_NOTE, DND_SHAPE, DND_CODE } from '../constants'
import { ShapeSticker } from '../../shape/ui/ShapeSticker.jsx'
import { Stage, Layer } from 'react-konva'
import { CodeBlock } from '../../code-block/ui/CodeBlock.jsx'

export const Board = forwardRef((_, ref) => {
    const boardRef = useRef(null)
    const stageRef = useRef(null)
    const [boardSize, setBoardSize] = useState({ width: 1000, height: 1000 })
    const stickers = useStickersStore((s) => s.stickers)
    const addSticker = useStickersStore((s) => s.addSticker)
    const topZ = useStickersStore((s) => s.topZ)
    const selectedId = useStickersStore((s) => s.selectedId)
    const [draggingShapeId, setDraggingShapeId] = useState(null)
    const [hoverShapeId, setHoverShapeId] = useState(null)
    const [transformingShapeId, setTransformingShapeId] = useState(null)
    const [lastTouched, setLastTouched] = useState(null)
    const handleDrop = useDropHandler(boardRef)

    useEffect(() => {
        const onTouched = (e) => {
            const detail = e?.detail
            if (!detail) return
            setLastTouched({ id: detail.id, type: detail.type })
        }
        window.addEventListener('sticker-touched', onTouched)
        return () => {
            window.removeEventListener('sticker-touched', onTouched)
        }
    }, [])

    useEffect(() => {
        const onStart = (e) => {
            setDraggingShapeId(e?.detail?.id ?? null)
        }
        const onEnd = () => {
            setDraggingShapeId(null)
        }

        window.addEventListener('shape-drag-start', onStart)
        window.addEventListener('shape-drag-end', onEnd)

        return () => {
            window.removeEventListener('shape-drag-start', onStart)
            window.removeEventListener('shape-drag-end', onEnd)
        }
    }, [])

    useEffect(() => {
        const onTransformStart = (e) => {
            setTransformingShapeId(e?.detail?.id ?? null)
        }
        const onTransformEnd = () => {
            setTransformingShapeId(null)
        }

        window.addEventListener('shape-transform-start', onTransformStart)
        window.addEventListener('shape-transform-end', onTransformEnd)

        return () => {
            window.removeEventListener('shape-transform-start', onTransformStart)
            window.removeEventListener('shape-transform-end', onTransformEnd)
        }
    }, [])

    useEffect(() => {
        if (!boardRef.current) {
            return
        }
        const el = boardRef.current
        const ro = new ResizeObserver(() => {
            const { clientWidth, clientHeight } = el
            setBoardSize({ width: clientWidth, height: clientHeight })
        })
        ro.observe(el)
        return () => {
            ro.disconnect()
        }
    }, [])

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
        if (e.dataTransfer.types.some(t => [DND_NOTE, DND_EMOJI, DND_SHAPE, DND_CODE].includes(t))) {
            e.preventDefault()
        }
    }

    const findShapeUnderPoint = (px, py, shapeStickers) => {
        const byTop = shapeStickers.slice().sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
        for (const s of byTop) {
            const sx = s.x ?? 0
            const sy = s.y ?? 0
            const sw = s.width ?? 0
            const sh = s.height ?? 0
            if (px >= sx && px <= sx + sw && py >= sy && py <= sy + sh) {
                return s.id
            }
        }
        return null
    }

    const isInsideDomSticker = (el) => {
        while (el) {
            if (el.dataset && (el.dataset.stickerType === 'note' || el.dataset.stickerType === 'emoji')) {
                return true
            }
            if (el.classList) {
                if (el.classList.contains('sticker-root') || el.classList.contains('emoji-item') || el.classList.contains('emoji-img') || el.classList.contains('sticker-context-menu') || el.classList.contains('sticker-drag-header')) {
                    return true
                }
            }
            el = el.parentElement
        }
        return false
    }

    const onBoardPointerMove = (e) => {
        const boardElem = boardRef.current
        if (!boardElem) {
            setHoverShapeId(null)
            return
        }

        if (transformingShapeId) {
            if (hoverShapeId !== transformingShapeId) {
                setHoverShapeId(transformingShapeId)
            }
            return
        }

        const topEl = document.elementFromPoint(e.clientX, e.clientY)
        if (topEl && isInsideDomSticker(topEl)) {
            if (hoverShapeId !== null) {
                setHoverShapeId(null)
            }
            return
        }

        const boardRect = boardElem.getBoundingClientRect()
        const px = Math.round(boardElem.scrollLeft + (e.clientX - boardRect.left))
        const py = Math.round(boardElem.scrollTop + (e.clientY - boardRect.top))

        const shapeStickers = stickers.filter(s => s.type === 'shape')
        const candidateId = findShapeUnderPoint(px, py, shapeStickers)
        if (!candidateId) {
            if (hoverShapeId !== null) {
                setHoverShapeId(null)
            }
            return
        }

        if (stageRef.current && typeof stageRef.current.getIntersection === 'function') {
            const node = stageRef.current.getIntersection({ x: px, y: py })
            if (!node) {
                if (hoverShapeId !== null) {
                    setHoverShapeId(null)
                }
                return
            }
            if (hoverShapeId !== candidateId) {
                setHoverShapeId(candidateId)
            }
            return
        }

        if (hoverShapeId !== candidateId) {
            setHoverShapeId(candidateId)
        }
    }

    const onBoardPointerLeave = () => {
        setHoverShapeId(null)
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
                onPointerMove={onBoardPointerMove}
                onPointerLeave={onBoardPointerLeave}
            >
                {(() => {
                    const shapeStickers = stickers
                        .filter(s => s.type === 'shape')
                        .slice()
                        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))

                    const boardElem = boardRef.current
                    const contentMinWidth = boardElem ? Math.max(boardElem.clientWidth, boardElem.scrollWidth) : boardSize.width
                    const contentMinHeight = boardElem ? Math.max(boardElem.clientHeight, boardElem.scrollHeight) : boardSize.height

                    if (shapeStickers.length === 0) {
                        return (
                            <div style={{ position: 'absolute', left: 0, top: 0, width: contentMinWidth, height: contentMinHeight, pointerEvents: 'none' }}>
                                <Stage
                                    width={contentMinWidth}
                                    height={contentMinHeight}
                                    ref={stageRef}
                                    onMouseDown={(e) => {
                                        const clickedOnEmpty = e.target === e.target.getStage()
                                        if (clickedOnEmpty) {
                                            useStickersStore.getState().selectSticker(null)
                                        }
                                    }}
                                >
                                    <Layer />
                                </Stage>
                            </div>
                        )
                    }

                    let maxX = -Infinity
                    let maxY = -Infinity
                    for (const s of shapeStickers) {
                        const sx = s.x ?? 0
                        const sy = s.y ?? 0
                        const sw = s.width ?? 0
                        const sh = s.height ?? 0
                        maxX = Math.max(maxX, sx + sw)
                        maxY = Math.max(maxY, sy + sh)
                    }

                    const PADDING = 40
                    maxX = Math.max(0, (maxX === -Infinity ? 0 : maxX) + PADDING)
                    maxY = Math.max(0, (maxY === -Infinity ? 0 : maxY) + PADDING)

                    const stageWidth = Math.max(contentMinWidth, maxX)
                    const stageHeight = Math.max(contentMinHeight, maxY)
                    const selectedIsShape = !!(selectedId && stickers.find(s => s.id === selectedId && s.type === 'shape'))
                    const shouldStageCatchEvents = !!draggingShapeId || selectedIsShape || !!hoverShapeId || !!transformingShapeId
                    const wrapperZ = transformingShapeId ? ((topZ || 0) + 1000) : (lastTouched && lastTouched.type === 'shape' ? ((topZ || 0) + 1000) : 0)

                    return (
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: stageWidth,
                                height: stageHeight,
                                pointerEvents: shouldStageCatchEvents ? 'auto' : 'none',
                                zIndex: wrapperZ,
                            }}
                        >
                            <Stage
                                width={stageWidth}
                                height={stageHeight}
                                ref={stageRef}
                                onMouseDown={(e) => {
                                    const clickedOnEmpty = e.target === e.target.getStage()
                                    if (clickedOnEmpty) {
                                        useStickersStore.getState().selectSticker(null)
                                    }
                                }}
                            >
                                <Layer>
                                    {shapeStickers.map(s => (
                                        <ShapeSticker key={s.id} id={s.id} />
                                    ))}
                                </Layer>
                            </Stage>
                        </div>
                    )
                })()}

                {stickers.map((s) => {
                    if (s.imageUrl) {
                        return <EmojiSticker key={s.id} id={s.id} />
                    }
                    if (s.type === 'shape') {
                        return null
                    }
                    if (s.type === 'code') {
                        return <CodeBlock key={s.id} id={s.id} />
                    }
                    return <NoteSticker key={s.id} id={s.id} />
                })}
            </div>
        </BoardContext.Provider>
    )
})
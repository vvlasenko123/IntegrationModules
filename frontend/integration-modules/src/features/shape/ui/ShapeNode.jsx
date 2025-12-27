import React, { useMemo, useRef, useEffect, useState } from 'react'
import { NodeResizer, useReactFlow, Handle, Position } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { shapes } from './shapes.jsx'
import '@xyflow/react/dist/style.css'
import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import { shapesApi } from '../../../shared/api/shapesApi'

export const ShapeNode = ({ id, data, selected, style }) => {
    const sticker = useStickersStore(s => s.stickers.find(st => st.id === data.stickerId))
    const updateSticker = useStickersStore(s => s.updateSticker)
    const bringToFront = useStickersStore(s => s.bringToFront)
    const selectSticker = useStickersStore(s => s.selectSticker)
    const selectedId = useStickersStore(s => s.selectedId)

    const { setNodes } = useReactFlow()

    const rotateControlRef = useRef(null)
    const rotationRef = useRef(0)
    const sizeRef = useRef({ width: 0, height: 0 })

    const [rotation, setRotation] = useState(0)
    const [localSize, setLocalSize] = useState({ width: 0, height: 0 })
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
    const [isRotating, setIsRotating] = useState(false)

    if (!sticker) {
        return null
    }

    const isSelected = selectedId === sticker.id

    const renderShape = useMemo(() => {
        const fn = shapes[sticker.shapeId]
        return fn ? fn(sticker) : shapes.square(sticker)
    }, [sticker.shapeId, sticker])

    const handleClick = (e) => {
        e.stopPropagation()
        bringToFront(sticker.id)
        selectSticker(sticker.id)
    }

    const handleContextMenu = (e) => {
        e.preventDefault()
        e.stopPropagation()

        let x = e.clientX
        let y = e.clientY

        if (x + 140 > window.innerWidth) {
            x = window.innerWidth - 148
        }
        if (y + 40 > window.innerHeight) {
            y = window.innerHeight - 48
        }

        setMenuPos({ x, y })
        setMenuVisible(true)
    }

    const handleDelete = () => {
        setMenuVisible(false)
        updateSticker(sticker.id, { deleted: true })
    }

    // 1) Инициализация и синхронизация rotation/size из стора -> локальные стейты + ref'ы
    useEffect(() => {
        const w = Number(sticker.width) || 140
        const h = Number(sticker.height) || 140
        const r = Number(sticker.rotation) || 0

        setLocalSize({ width: w, height: h })
        sizeRef.current = { width: w, height: h }

        rotationRef.current = r
        setRotation(r)
    }, [sticker.width, sticker.height, sticker.rotation])

    // 2) rotationRef всегда должен быть актуальным
    useEffect(() => {
        rotationRef.current = rotation
    }, [rotation])

    // 3) D3 drag handler (важно: считаем deg внутри drag, и в end берём rotationRef)
    useEffect(() => {
        if (!isSelected) {
            return
        }

        const el = rotateControlRef.current
        if (!el) {
            return
        }

        const selection = select(el)

        const dragHandler = drag()
            .on('start', (evt) => {
                evt.sourceEvent?.stopPropagation?.()
                setIsRotating(true)
            })
            .on('drag', (evt) => {
                const parent = evt.sourceEvent?.target?.parentElement
                if (!parent) {
                    return
                }

                const rect = parent.getBoundingClientRect()
                const cx = rect.left + rect.width / 2
                const cy = rect.top + rect.height / 2
                const dx = evt.sourceEvent.clientX - cx
                const dy = evt.sourceEvent.clientY - cy

                const rad = Math.atan2(dy, dx)
                const deg = rad * (180 / Math.PI) + 90

                rotationRef.current = deg
                setRotation(deg)
                updateSticker(sticker.id, { rotation: deg })
            })
            .on('end', async () => {
                setIsRotating(false)

                const width = Math.max(1, Math.round(Number(sizeRef.current.width) || 1))
                const height = Math.max(1, Math.round(Number(sizeRef.current.height) || 1))
                const rot = Number(rotationRef.current) || 0

                try {
                    await shapesApi.updateBoardTransform(id, width, height, rot)
                } catch (e) {
                    console.warn('Не удалось сохранить поворот фигуры', e)
                }
            })

        selection.call(dragHandler)

        return () => {
            selection.on('.drag', null)
        }
    }, [isSelected, id, sticker.id, updateSticker])

    return (
        <>
            <div
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                style={{
                    ...style,
                    position: 'relative',
                    zIndex: sticker.zIndex,
                    cursor: isRotating ? 'grabbing' : 'pointer',
                    width: localSize.width,
                    height: localSize.height,
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: '50% 50%',
                    pointerEvents: 'auto',
                }}
                data-drag-disabled={isRotating}
            >
                <NodeResizer
                    isVisible={isSelected}
                    minWidth={30}
                    minHeight={30}
                    resizeHandles={['top', 'right', 'bottom', 'left', 'topRight', 'topLeft', 'bottomRight', 'bottomLeft']}
                    onResize={(_, params) => {
                        const w = Number(params.width) || 1
                        const h = Number(params.height) || 1

                        setLocalSize({ width: w, height: h })
                        sizeRef.current = { width: w, height: h }
                    }}
                    onResizeEnd={async (_, params) => {
                        const width = Math.max(1, Math.round(Number(params.width) || 1))
                        const height = Math.max(1, Math.round(Number(params.height) || 1))
                        const rot = Number(rotationRef.current) || 0

                        setLocalSize({ width, height })
                        sizeRef.current = { width, height }

                        setNodes(nodes =>
                            nodes.map(n => {
                                if (n.id !== id) {
                                    return n
                                }

                                return { ...n, style: { ...n.style, width, height } }
                            })
                        )

                        updateSticker(sticker.id, { width, height })

                        try {
                            await shapesApi.updateBoardTransform(id, width, height, rot)
                        } catch (e) {
                            console.warn('Не удалось сохранить размеры фигуры', e)
                        }
                    }}
                />

                <svg
                    width={localSize.width}
                    height={localSize.height}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {renderShape}
                </svg>

                {isSelected && (
                    <div
                        ref={rotateControlRef}
                        className="nodrag nopan"
                        onMouseDown={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                        }}
                        style={{
                            position: 'absolute',
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: 'blue',
                            top: -8,
                            right: -8,
                            cursor: 'grab',
                            zIndex: 1000,
                        }}
                    />
                )}

                <Handle type="target" position={Position.Left} className="z-100000" />
                <Handle type="source" position={Position.Right} className="z-100000" />
            </div>

            {menuVisible && (
                <div
                    className="sticker-context-menu"
                    style={{ left: menuPos.x, top: menuPos.y, position: 'fixed' }}
                >
                    <button onClick={handleDelete}>Удалить</button>
                </div>
            )}
        </>
    )
}

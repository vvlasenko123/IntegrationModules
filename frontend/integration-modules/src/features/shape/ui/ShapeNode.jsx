import React, { useMemo, useRef, useEffect, useState } from 'react'
import { NodeResizer, useReactFlow, Handle, Position } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { shapes } from './shapes.jsx'
import '@xyflow/react/dist/style.css'
import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import { shapesApi } from '../../../shared/api/shapesApi'

export const ShapeNode = ({ id, data, style }) => {
    const sticker = useStickersStore(s => s.stickers.find(st => st.id === data.stickerId))
    const updateSticker = useStickersStore(s => s.updateSticker)
    const bringToFront = useStickersStore(s => s.bringToFront)
    const selectSticker = useStickersStore(s => s.selectSticker)
    const selectedId = useStickersStore(s => s.selectedId)
    const removeSticker = useStickersStore(s => s.removeSticker)
    const { setNodes } = useReactFlow()

    const rotateControlRef = useRef(null)
    const rotationRef = useRef(0)
    const sizeRef = useRef({ width: 0, height: 0 })

    const [rotation, setRotation] = useState(0)
    const [localSize, setLocalSize] = useState({ width: 140, height: 140 })
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
    const [isRotating, setIsRotating] = useState(false)

    const isSelected = selectedId === sticker?.id

    if (!sticker) return null

    useEffect(() => {
        const w = Number(sticker.width) || 140
        const h = Number(sticker.height) || 140
        const r = Number(sticker.rotation) || 0

        setLocalSize({ width: w, height: h })
        sizeRef.current = { width: w, height: h }

        rotationRef.current = r
        setRotation(r)
    }, [sticker.width, sticker.height, sticker.rotation])

    useEffect(() => {
        rotationRef.current = rotation
    }, [rotation])

    useEffect(() => {
        if (!isSelected) return
        const el = rotateControlRef.current
        if (!el) return

        const selection = select(el)

        const dragHandler = drag()
            .on('start', evt => {
                evt.sourceEvent?.stopPropagation?.()
                setIsRotating(true)
            })
            .on('drag', evt => {
                const parent = evt.sourceEvent?.target?.parentElement
                if (!parent) return

                const rect = parent.getBoundingClientRect()
                const cx = rect.left + rect.width / 2
                const cy = rect.top + rect.height / 2
                const dx = evt.sourceEvent.clientX - cx
                const dy = evt.sourceEvent.clientY - cy

                const rad = Math.atan2(dy, dx)
                const deg = rad * (180 / Math.PI) + 90

                rotationRef.current = deg
                setRotation(deg)
            })
            .on('end', async () => {
                setIsRotating(false)
                const width = Math.max(1, Math.round(sizeRef.current.width))
                const height = Math.max(1, Math.round(sizeRef.current.height))
                const rot = Number(rotationRef.current) || 0

                updateSticker(sticker.id, { rotation: rot })

                try {
                    await shapesApi.updateBoardTransform(id, width, height, rot)
                } catch (e) {
                    console.warn('Не удалось сохранить поворот фигуры', e)
                }
            })

        selection.call(dragHandler)

        return () => selection.on('.drag', null)
    }, [isSelected, id, sticker.id, updateSticker])

    const renderShape = useMemo(() => {
        const fn = shapes[sticker.shapeId]
        return fn ? fn(sticker) : shapes.square(sticker)
    }, [sticker.shapeId, sticker])

    const handleClick = e => {
        e.stopPropagation()
        bringToFront(sticker.id)
        selectSticker(sticker.id)
    }

    const handleContextMenu = e => {
        e.preventDefault()
        e.stopPropagation()
        let x = e.clientX
        let y = e.clientY
        if (x + 140 > window.innerWidth) x = window.innerWidth - 148
        if (y + 40 > window.innerHeight) y = window.innerHeight - 48
        setMenuPos({ x, y })
        setMenuVisible(true)
    }

    const handleDelete = async () => {
        setMenuVisible(false)
        try {
            await shapesApi.delete(sticker.id)
            removeSticker(sticker.id)
        } catch (err) {
            console.warn('Не удалось удалить фигуру', err)
            alert('Не удалось удалить фигуру')
        }
    }

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
                    resizeHandles={[
                        'top', 'right', 'bottom', 'left',
                        'topRight', 'topLeft', 'bottomRight', 'bottomLeft'
                    ]}
                    onResize={(_, params) => {
                        const w = Number(params.width) || 1
                        const h = Number(params.height) || 1
                        setLocalSize({ width: w, height: h })
                        sizeRef.current = { width: w, height: h }
                    }}
                    onResizeEnd={async (_, params) => {
                        const width = Math.max(1, Math.round(params.width))
                        const height = Math.max(1, Math.round(params.height))
                        const rot = Number(rotationRef.current) || 0

                        setLocalSize({ width, height })
                        sizeRef.current = { width, height }

                        setNodes(nodes =>
                            nodes.map(n => n.id === id ? { ...n, style: { ...n.style, width, height } } : n)
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
                    style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        padding: 2,
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                    <button
                        style={{
                            border: 'none',
                            background: 'none',
                            padding: '3px 7px',
                            cursor: 'pointer',
                            fontSize: 12,
                            color: '#3c3c3c'
                        }}
                        onClick={handleDelete}
                    >
                        Удалить
                    </button>
                </div>
            )}
        </>
    )
}

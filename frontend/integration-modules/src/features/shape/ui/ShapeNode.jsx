import React, { useMemo, useRef, useEffect, useState } from 'react'
import { NodeResizer, useReactFlow, Handle, Position } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { shapes } from './shapes.jsx'
import '@xyflow/react/dist/style.css'
import { select } from 'd3-selection'
import { drag } from 'd3-drag'
import { shapesApi } from '../../../shared/api/shapesApi'

export const ShapeNode = ({ id, data, style }) => {
    const sticker = useStickersStore(s =>
        s.stickers.find(st => st.id === data.stickerId)
    )

    const updateSticker = useStickersStore(s => s.updateSticker)
    const bringToFront = useStickersStore(s => s.bringToFront)
    const selectSticker = useStickersStore(s => s.selectSticker)
    const selectedId = useStickersStore(s => s.selectedId)
    const { setNodes } = useReactFlow()
    const rotateControlRef = useRef(null)
    const rotationRef = useRef(0)
    const sizeRef = useRef({ width: 0, height: 0 })
    const [rotation, setRotation] = useState(0)
    const [localSize, setLocalSize] = useState({ width: 140, height: 140 })
    const [isRotating, setIsRotating] = useState(false)

    const isSelected = selectedId === sticker?.id

    useEffect(() => {
        if (!sticker) return
        const w = Number(sticker.width) || 140
        const h = Number(sticker.height) || 140
        const r = Number(sticker.rotation) || 0

        setLocalSize({ width: w, height: h })
        sizeRef.current = { width: w, height: h }

        rotationRef.current = r
        setRotation(r)
    }, [sticker])

    useEffect(() => {
        rotationRef.current = rotation
    }, [rotation])

    useEffect(() => {
        if (!sticker || !isSelected) return

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
            .on('end', () => {
                setIsRotating(false)
                const rot = Number(rotationRef.current) || 0
                updateSticker(sticker.id, { rotation: rot })
            })

        selection.call(dragHandler)

        return () => selection.on('.drag', null)
    }, [isSelected, sticker, updateSticker])

    const renderShape = useMemo(() => {
        if (!sticker) return null
        const fn = shapes[sticker.shapeId]
        return fn ? fn(sticker) : shapes.square(sticker)
    }, [sticker])

    const handleClick = e => {
        e.stopPropagation()
        if (!sticker) return
        bringToFront(sticker.id)
        selectSticker(sticker.id)
    }

    if (!sticker) return null

    return (
        <>
            <div
                onClick={handleClick}
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
        </>
    )
}

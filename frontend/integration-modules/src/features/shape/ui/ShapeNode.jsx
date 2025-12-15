import React, { useState, useMemo, useRef, useEffect } from 'react'
import { NodeResizer, useReactFlow, Handle, Position } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { shapes } from './shapes.jsx'
import '@xyflow/react/dist/style.css'
import { select } from 'd3-selection';
import { drag } from 'd3-drag';

export const ShapeNode = ({ id, data, selected, style }) => {
    const sticker = useStickersStore(s =>
        s.stickers.find(st => st.id === data.stickerId)
    )
    const updateSticker = useStickersStore(s => s.updateSticker)
    const bringToFront = useStickersStore(s => s.bringToFront)
    const selectSticker = useStickersStore(s => s.selectSticker)
    const selectedId = useStickersStore(s => s.selectedId)
    const { setNodes } = useReactFlow()
    const rotateControlRef = useRef(null)
    const [rotation, setRotation] = useState(sticker?.rotation || 0)
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

    if (!sticker) return null

    const { width, height, shapeId, zIndex } = sticker
    const [localSize, setLocalSize] = useState({ width, height })
    const isSelected = selectedId === sticker.id

    const renderShape = useMemo(() => {
        const fn = shapes[shapeId]
        return fn ? fn(sticker) : shapes.square(sticker)
    }, [shapeId, sticker])

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

    const handleDelete = () => {
        setMenuVisible(false)
        updateSticker(sticker.id, { deleted: true })
    }

    useEffect(() => {
        if (!rotateControlRef.current) return;
        const selection = select(rotateControlRef.current);
        const dragHandler = drag().on('drag', (evt) => {
            const rect = evt.sourceEvent.target.parentElement.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = evt.sourceEvent.clientX - cx;
            const dy = evt.sourceEvent.clientY - cy;
            const rad = Math.atan2(dy, dx);
            const deg = rad * (180 / Math.PI);
            setRotation(deg + 90);
            updateSticker(sticker.id, { rotation: deg + 90 });
        });
        selection.call(dragHandler);
        return () => selection.on('.drag', null);
    }, [sticker.id, updateSticker])

    return (
        <>
            <div
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                style={{
                    ...style,
                    position: 'relative',
                    zIndex,
                    borderRadius: shapeId === 'circle' ? '50%' : 0,
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    width: localSize.width,
                    height: localSize.height,
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: '50% 50%'
                }}
            >
                {/* NodeResizer */}
                <NodeResizer
                    isVisible={isSelected}
                    minWidth={30}
                    minHeight={30}
                    handleStyle={{
                        width: 8,
                        height: 8,
                        background: 'rgba(0,0,0,0.5)',
                        borderRadius: 2,
                    }}
                    // Указываем, какие стороны можно тянуть
                    resizeHandles={['top', 'right', 'bottom', 'left', 'topRight', 'topLeft', 'bottomRight', 'bottomLeft']}
                    onResize={({ width: w, height: h }) => {
                        setLocalSize({ width: w, height: h })
                    }}
                    onResizeEnd={({ width: w, height: h }) => {
                        setNodes(nodes =>
                            nodes.map(n =>
                                n.id === id
                                    ? { ...n, style: { ...n.style, width: w, height: h } }
                                    : n
                            )
                        )
                        updateSticker(sticker.id, { width: w, height: h })
                    }}
                />

                {/* SVG фигура */}
                <svg
                    width={localSize.width}
                    height={localSize.height}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {renderShape}
                </svg>

                {/* Ручка вращения */}
                <div
                    ref={rotateControlRef}
                    style={{
                        position: 'absolute',
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: 'blue',
                        top: -8,
                        right: -8,
                        cursor: 'grab',
                        zIndex: 1000
                    }}
                />

                <Handle type="target" position={Position.Left} className="z-100000" />
                <Handle type="source" position={Position.Right} className="z-100000" />
            </div>

            {/* Контекстное меню */}
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

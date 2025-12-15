import React, { useState, useMemo } from 'react'
import { NodeResizer, useReactFlow, Handle, Position } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { shapes } from './shapes.jsx'
import '@xyflow/react/dist/style.css'

export const ShapeNode = ({ id, data, selected, style}) => {
    const sticker = useStickersStore(s =>
        s.stickers.find(st => st.id === data.stickerId)
    )
    const updateSticker = useStickersStore(s => s.updateSticker)
    const bringToFront = useStickersStore(s => s.bringToFront)
    const selectSticker = useStickersStore(s => s.selectSticker)
    const selectedId = useStickersStore(s => s.selectedId)

    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
    const { setNodes } = useReactFlow()

    if (!sticker) return null

    const { width, height, rotation, fill, stroke, shapeId, zIndex } = sticker

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

    return (
        <>
            <div
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                style={{
                    ...style,
                    transform: `rotate(${rotation || 0}deg)`,
                    position: 'relative',
                    zIndex,
                    borderRadius: shapeId === 'circle' ? '50%' : 0,
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                }}
            >
                <NodeResizer
                    isVisible={isSelected}
                    minWidth={30}
                    minHeight={30}
                    onResize={({ width, height }) => {
                        setNodes(nodes =>
                            nodes.map(n =>
                                n.id === id ? { ...n, style: { ...n.style, width, height } } : n
                            )
                        )
                    }}

                />
                <div style={{ width: '100%', height: '100%', transform: `rotate(${rotation}deg)` }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {renderShape}
                </svg>
                </div>
            </div>
            <Handle type="target" position={Position.Left} className="z-100000" />
            <Handle type="source" position={Position.Right} className="z-100000" />
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
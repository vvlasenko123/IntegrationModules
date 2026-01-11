// modules/shapes/ShapeBoardWidget.jsx
import React, { useEffect, useRef } from 'react'
import { ShapeToolbar } from './ShapeToolbar.jsx'
import { Board } from '../../features/board/ui/Board.jsx'
import { useStickersStore } from '../../entities/stickers/model/useStickersStore.js'
import { shapesApi } from '../../shared/api/shapesApi.js'
import '../../styles/sticker.css'

export const ShapeBoardWidget = () => {
    const addSticker = useStickersStore(s => s.addSticker)
    const addStickers = useStickersStore(s => s.addStickers)
    const boardRef = useRef(null)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const [allShapes, boardShapes] = await Promise.all([
                    shapesApi.getAll(),
                    shapesApi.getBoard()
                ])
                if (cancelled) return

                const shapeKeyByDbId = new Map(
                    allShapes.map(x => [String(x.id), x.shapeId])
                )

                let x = 30, y = 30
                const items = boardShapes.map(s => {
                    const shapeKey = shapeKeyByDbId.get(String(s.shapeId)) ?? 'square'
                    const item = {
                        id: s.id,
                        stickerId: s.id,
                        type: 'shape',
                        shapeId: shapeKey,
                        shapeDbId: s.shapeId,
                        x, y,
                        width: s.width ?? 140,
                        height: s.height ?? 140,
                        rotation: s.rotation ?? 0,
                        zIndex: 1,
                        fill: 'transparent',
                        stroke: '#000'
                    }
                    x += 24; y += 24
                    return item
                })

                addStickers(items)
            } catch (err) {
                console.warn('ShapeBoardWidget: failed to load', err)
            }
        })()
        return () => { cancelled = true }
    }, [addStickers])

    const createShape = async (shape) => {
        try {
            const created = await shapesApi.addToBoard(
                shape.id,
                140,
                140,
                0
            )

            if (!created) return

            addSticker({
                id: created.id,
                stickerId: created.id,
                type: 'shape',
                shapeId: shape.id,
                shapeDbId: shape.id,
                x: 260,
                y: 120,
                width: created.width ?? 140,
                height: created.height ?? 140,
                rotation: created.rotation ?? 0,
                zIndex: 1,
                fill: 'transparent',
                stroke: '#000'
            })
        } catch (err) {
            console.warn('ShapeBoardWidget:create failed', err)
        }
    }

    return (
        <div className="relative flex h-screen w-screen bg-gray-100">
            <ShapeToolbar onShapeClick={createShape} />
            <Board ref={boardRef} />
        </div>
    )
}

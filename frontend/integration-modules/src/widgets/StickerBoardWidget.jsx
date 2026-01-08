import React, { useEffect, useRef, useState } from 'react'
import { LeftToolbar } from '../components/LeftToolbar.jsx'
import { Board } from '../features/board/ui/Board.jsx'
import { useStickersStore } from '../entities/stickers/model/useStickersStore.js'
import { notesApi } from '../shared/api/notesApi.js'
import { stickersApi } from '../shared/api/stickerApi.js'
import { NOTE_W, NOTE_H, EMOJI_W, EMOJI_H } from '../features/board/constants'
import { shapesApi } from '../shared/api/shapesApi.js'
import { markdownApi } from '../shared/api/markdownApi'
import { roadmapApi} from "../shared/api/roadmapApi.js";

const SafeFallbackWidget = ({ children }) => <div>{children}</div>

export const StickerBoardWidget = () => {
    const addSticker = useStickersStore((state) => state.addSticker)
    const setStickers = useStickersStore((state) => state.setStickers)
    const setEdges = useStickersStore((state) => state.setEdges)

    const boardRef = useRef(null)
    const [WidgetComp, setWidgetComp] = useState(() => SafeFallbackWidget)

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const [
                    notes,
                    boardEmojis,
                    allShapes,
                    boardShapes,
                    boardMarkdowns,
                    roadmaps
                ] = await Promise.all([
                    notesApi.getAll(),
                    stickersApi.getBoard(),
                    shapesApi.getAll(),
                    shapesApi.getBoard(),
                    markdownApi.getBoard(),
                    roadmapApi.getAll()
                ])

                const shapeKeyByDbId = new Map(allShapes.map(x => [String(x.id), x.shapeId]))

                let x = 30
                let y = 30
                const items = []
                const edges = []

                // NOTES
                for (const n of notes) {
                    const w = n.width ?? NOTE_W
                    const h = n.height ?? NOTE_H

                    items.push({
                        id: n.id,
                        x,
                        y,
                        color: n.color,
                        width: w,
                        height: h,
                        text: n.content ?? '',
                        zIndex: 1
                    })

                    x += 24
                    y += 24
                }

                // EMOJIS
                for (const e of boardEmojis) {
                    const w = e.width ?? EMOJI_W
                    const h = e.height ?? EMOJI_H

                    items.push({
                        id: e.id,
                        x,
                        y,
                        color: 'transparent',
                        width: w,
                        height: h,
                        text: '',
                        zIndex: 1,
                        imageUrl: e.url,
                        stickerId: e.stickerId
                    })

                    x += 24
                    y += 24
                }

                // MARKDOWNS
                for (const m of boardMarkdowns) {
                    const w = m.width ?? 600
                    const h = m.height ?? 400

                    items.push({
                        id: m.id,
                        stickerId: m.markdownId,
                        isEditorVisible: m.isEditorVisible ?? true,
                        type: 'markdown',
                        x,
                        y,
                        width: w,
                        height: h,
                        text: m.content ?? '',
                        zIndex: 1
                    })

                    x += 24
                    y += 24
                }

                // SHAPES
                for (const s of boardShapes) {
                    const w = s.width ?? 140
                    const h = s.height ?? 140
                    const r = s.rotation ?? 0

                    const shapeKey = shapeKeyByDbId.get(String(s.shapeId)) ?? 'square'

                    items.push({
                        id: s.id,
                        stickerId: s.id,
                        type: 'shape',
                        shapeId: shapeKey,
                        shapeDbId: s.shapeId,
                        x,
                        y,
                        width: w,
                        height: h,
                        rotation: r,
                        zIndex: 1,
                        fill: 'transparent',
                        stroke: '#000',
                    })

                    x += 24
                    y += 24
                }

                // ROADMAPS
                for (const r of roadmaps) {
                    const w = r.width ?? 200
                    const h = r.height ?? 120

                    items.push({
                        id: String(r.id),
                        type: 'roadmap',
                        x,
                        y,
                        width: w,
                        height: h,
                        text: r.text ?? '',
                        description: r.description ?? '',
                        date: r.date ?? null,
                        completed: r.completed ?? false,
                        cancelled: r.cancelled ?? false,
                        parentId: r.parentId ?? null,
                        zIndex: r.zIndex ?? 1
                    })

                    if (r.parentId) {
                        edges.push({
                            id: `e-${r.parentId}-${r.id}`,
                            source: String(r.parentId),
                            target: String(r.id),
                            type: 'default',
                            animated: false,
                        })
                    }

                    x += 24
                    y += 24
                }

                setStickers(items)
                setEdges(edges)
            } catch (e) {
                console.warn('Не удалось загрузить доску:', e)
            }
        }

        loadBoard()
    }, [setStickers, setEdges])

    useEffect(() => {
        let mounted = true

        import('@xyflow/react')
            .then((mod) => {
                if (!mounted) {
                    return
                }

                const candidate = (mod && (mod.Widget || mod.default || mod?.widget || mod?.XyflowWidget)) ?? null
                if (typeof candidate === 'function' || React.isValidElement(candidate)) {
                    setWidgetComp(() => candidate)
                } else {
                    setWidgetComp(() => SafeFallbackWidget)
                }
            })
            .catch(() => {
                if (mounted) {
                    setWidgetComp(() => SafeFallbackWidget)
                }
            })

        return () => {
            mounted = false
        }
    }, [])

    const Wrapper = WidgetComp || SafeFallbackWidget

    const handlePick = async (color) => {
        try {
            const created = await notesApi.create(color, NOTE_W, NOTE_H)

            const w = created.width ?? NOTE_W
            const h = created.height ?? NOTE_H

            if (boardRef.current?.addStickerAtCenter) {
                boardRef.current.addStickerAtCenter(color, {
                    id: created.id,
                    text: created.content ?? '',
                    width: w,
                    height: h
                })
                return
            }

            addSticker({
                id: created.id,
                x: 260,
                y: 120,
                color,
                width: w,
                height: h,
                text: created.content ?? ''
            })
        } catch (e) {
            console.warn('Не удалось создать заметку:', e)
        }
    }

    return (
        <Wrapper>
            <div className="relative flex h-screen w-screen bg-gray-100">
                <LeftToolbar onPick={handlePick} />
                <Board ref={boardRef} />
            </div>
        </Wrapper>
    )
}
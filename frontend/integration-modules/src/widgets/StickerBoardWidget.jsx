import React, { useEffect, useRef, useState } from 'react'
import { LeftToolbar } from '../components/LeftToolbar.jsx'
import { Board } from '../features/board/ui/Board.jsx'
import { useStickersStore } from '../entities/stickers/model/useStickersStore.js'
import { notesApi } from '../shared/api/notesApi.js'
import { stickersApi } from '../shared/api/stickerApi.js'
import { NOTE_W, NOTE_H, EMOJI_W, EMOJI_H } from '../features/board/constants'
import { shapesApi } from '../shared/api/shapesApi.js'

const SafeFallbackWidget = ({ children }) => <div>{children}</div>

export const StickerBoardWidget = () => {
    const reset = useStickersStore((state) => state.reset)
    const addSticker = useStickersStore((state) => state.addSticker)
    const setStickers = useStickersStore((state) => state.setStickers)

    const boardRef = useRef(null)
    const [WidgetComp, setWidgetComp] = useState(() => SafeFallbackWidget)

    useEffect(() => {
        const loadNotes = async () => {
            try {
                const [notes, boardEmojis, allShapes, boardShapes] = await Promise.all([
                    notesApi.getAll(),
                    stickersApi.getBoard(),
                    shapesApi.getAll(),
                    shapesApi.getBoard()
                ])

                const shapeKeyByDbId = new Map(allShapes.map(x => [String(x.id), x.shapeId]))

                let x = 30
                let y = 30
                const items = []

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

                setStickers(items)
            } catch (e) {
                console.warn('Не удалось загрузить доску:', e)
            }
        }

        loadNotes()
    }, [setStickers])

    useEffect(() => {
        let mounted = true

        import('@xyflow/react')
            .then((mod) => {
                if (!mounted) return
                const candidate = (mod && (mod.Widget || mod.default || mod?.widget || mod?.XyflowWidget)) ?? null
                if (typeof candidate === 'function' || React.isValidElement(candidate)) {
                    setWidgetComp(() => candidate)
                } else {
                    setWidgetComp(() => SafeFallbackWidget)
                }
            })
            .catch(() => { if (mounted) setWidgetComp(() => SafeFallbackWidget) })

        return () => { mounted = false }
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

                <div className="absolute left-20 top-4 z-50">
                    <div className="mt-3">
                        <button
                            onClick={() => reset()}
                            className="px-3 py-1 rounded bg-red-500 text-white text-sm pointer-events-auto"
                        >
                            Сбросить
                        </button>
                    </div>
                </div>

                <Board ref={boardRef} />
            </div>
        </Wrapper>
    )
}
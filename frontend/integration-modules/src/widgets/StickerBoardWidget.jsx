import React, { useEffect, useRef, useState } from 'react'
import { LeftToolbar } from '../components/LeftToolbar.jsx'
import { Board } from '../features/board/ui/Board.jsx'
import { useStickersStore } from '../entities/stickers/model/useStickersStore.js'
import { notesApi } from '../shared/api/notesApi.js'
import { stickersApi } from '../shared/api/stickerApi.js'

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
                const [notes, boardEmojis] = await Promise.all([
                    notesApi.getAll(),
                    stickersApi.getBoard()
                ])

                let x = 30
                let y = 30
                const items = []

                for (const n of notes) {
                    const w = n.width ?? 160
                    const h = n.height ?? 160

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
                    const w = e.width ?? 91
                    const h = e.height ?? 84

                    items.push({
                        id: e.id,
                        stickerId: e.stickerId,
                        x,
                        y,
                        color: 'transparent',
                        width: w,
                        height: h,
                        text: '',
                        zIndex: 1,
                        imageUrl: e.url
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
                if (!mounted) {
                    return
                }

                const candidate =
                    (mod && (mod.Widget || mod.default || mod?.widget || mod?.XyflowWidget)) ?? null

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

            if (boardRef.current && typeof boardRef.current.addStickerAtCenter === 'function') {
                boardRef.current.addStickerAtCenter(color, {
                    id: created.id,
                    text: created.content ?? '',
                    width: created.width ?? NOTE_W,
                    height: created.height ?? NOTE_H
                })
                return
            }

            addSticker({
                id: created.id,
                x: 260,
                y: 120,
                color,
                width: created.width ?? NOTE_W,
                height: created.height ?? NOTE_H,
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
                            onClick={() => { reset() }}
                            className="px-3 py-1 rounded bg-red-500 text-white text-sm pointer-events-auto">
                            Сбросить
                        </button>
                    </div>
                </div>

                <Board ref={boardRef} />
            </div>
        </Wrapper>
    )
}
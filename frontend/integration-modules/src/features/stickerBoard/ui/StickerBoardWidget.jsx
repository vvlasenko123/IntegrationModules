import React, { useEffect, useRef, useState } from 'react'
import { LeftToolbar } from './LeftToolbar'
import { Board } from './Board'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { notesApi } from '../../../shared/api/notesApi'

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
                const notes = await notesApi.getAll()

                let x = 30
                let y = 30

                const mapped = notes.map((n) => {
                    const item = {
                        id: n.id,
                        x,
                        y,
                        color: n.color,
                        width: 160,
                        height: 160,
                        text: n.content ?? '',
                        zIndex: 1
                    }

                    x += 24
                    y += 24

                    return item
                })

                setStickers(mapped)
            } catch (e) {
                console.warn('Не удалось загрузить заметки:', e)
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
            const created = await notesApi.create(color)

            if (boardRef.current && typeof boardRef.current.addStickerAtCenter === 'function') {
                boardRef.current.addStickerAtCenter(color, { id: created.id, text: created.content ?? '' })
                return
            }

            addSticker({
                id: created.id,
                x: 260,
                y: 120,
                color,
                width: 160,
                height: 160,
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

                <div className="p-4">
                    <div className="mt-3">
                        <button
                            onClick={() => reset()}
                            className="px-3 py-1 rounded bg-red-500 text-white text-sm"
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
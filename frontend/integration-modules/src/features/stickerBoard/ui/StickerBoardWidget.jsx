import React, { useEffect, useRef, useState } from 'react'
import { LeftToolbar } from './LeftToolbar'
import { Board } from './Board'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'

const SafeFallbackWidget = ({ children }) => <div>{children}</div>

/**
 * StickerBoardWidget — теперь использует Board (реф) для добавления стикеров в центр.
 * LeftToolbar получает onPick, который вызывает boardRef.current.addStickerAtCenter.
 */

export const StickerBoardWidget = () => {
    const reset = useStickersStore(state => state.reset)
    const boardRef = useRef(null)
    const [WidgetComp, setWidgetComp] = useState(() => SafeFallbackWidget)

    useEffect(() => {
        let mounted = true
        import('@xyflow/react')
            .then(mod => {
                console.info('[StickerBoardWidget] @xyflow/react exports:', mod)
                if (!mounted) return
                const candidate =
                    (mod && (mod.Widget || mod.default || mod?.widget || mod?.XyflowWidget)) ?? null

                if (typeof candidate === 'function' || React.isValidElement(candidate)) {
                    setWidgetComp(() => candidate)
                } else {
                    console.warn('[StickerBoardWidget] @xyflow/react export is not a component — using fallback.')
                    setWidgetComp(() => SafeFallbackWidget)
                }
            })
            .catch(err => {
                console.warn('[StickerBoardWidget] Failed to import @xyflow/react — using fallback. Error:', err)
                if (mounted) setWidgetComp(() => SafeFallbackWidget)
            })

        return () => { mounted = false }
    }, [])

    const Wrapper = WidgetComp || SafeFallbackWidget

    // Передаём функцию в LeftToolbar: при выборе цвета будет вызвана addStickerAtCenter
    const handlePick = (color) => {
        if (boardRef.current && typeof boardRef.current.addStickerAtCenter === 'function') {
            boardRef.current.addStickerAtCenter(color)
        } else {
            // fallback: используем Zustand addSticker напрямую
            useStickersStore.getState().addSticker({ x: 260, y: 120, color, width: 160, height: 160, text: '' })
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
// modules/markdown/MarkdownBoardWidget.jsx
import React, { useEffect, useRef } from 'react'
import '../../features/markdown/markdown.css'
import { MarkdownToolbar } from './MarkdownToolbar.jsx'
import { Board } from '../../features/board/ui/Board.jsx'
import { useStickersStore } from '../../entities/stickers/model/useStickersStore.js'
import { markdownApi } from '../../shared/api/markdownApi'

export const MarkdownBoardWidget = () => {
    const addStickers = useStickersStore(s => s.addStickers)
    const addSticker = useStickersStore(s => s.addSticker)
    const boardRef = useRef(null)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const boardMarkdowns = await markdownApi.getBoard()
                if (cancelled) return
                let x = 30, y = 30
                const items = boardMarkdowns.map(m => {
                    const w = m.width ?? 600
                    const h = m.height ?? 400
                    const item = {
                        id: m.id,
                        stickerId: m.markdownId,
                        isEditorVisible: m.isEditorVisible ?? true,
                        type: 'markdown',
                        x, y,
                        width: w,
                        height: h,
                        text: m.content ?? '',
                        zIndex: 1
                    }
                    x += 24; y += 24
                    return item
                })
                addStickers(items)
            } catch (err) {
                console.warn('MarkdownBoardWidget: failed to load', err)
            }
        })()
        return () => { cancelled = true }
    }, [addStickers])

    const createMarkdown = async (content = '') => {
        try {
            const created = await markdownApi.create(
                content,
                600,
                400
            )

            if (!created) return

            addSticker({
                id: String(created.id),
                stickerId: created.markdownId ?? created.id,
                type: 'markdown',
                isEditorVisible: true,
                x: 260,
                y: 120,
                width: created.width ?? 600,
                height: created.height ?? 400,
                text: created.content ?? '',
                zIndex: created.zIndex
            })
        } catch (err) {
            console.warn('MarkdownBoardWidget:create failed', err)
        }
    }

    return (
        <div className="relative flex h-screen w-screen bg-gray-100">
            <MarkdownToolbar onCreateClick={createMarkdown} />
            <Board ref={boardRef} />
        </div>
    )
}

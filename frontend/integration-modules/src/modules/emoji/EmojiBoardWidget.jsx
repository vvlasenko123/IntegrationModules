import React, { useEffect, useRef } from 'react'

import { EmojiToolbar } from './EmojiToolbar.jsx'
import { Board } from '../../features/board/ui/Board.jsx'
import { useStickersStore } from '../../entities/stickers/model/useStickersStore.js'
import { stickersApi } from '../../shared/api/stickerApi.js'
import { EMOJI_W, EMOJI_H, DND_EMOJI } from '../../features/board/constants.js'
import { EMOJI_CATALOG, EMOJI_MAP } from '../../features/emoji-sticker/stickers.js'

const getLocalEmojiUrl = async (stickerId) => {
    if (EMOJI_MAP?.[String(stickerId)]) return EMOJI_MAP[String(stickerId)]
    try {
        const info = await stickersApi.getById(stickerId)
        if (info?.name) {
            const local = EMOJI_CATALOG.find(e => e.name === info.name)
            if (local) return local.url
        }
    } catch (err) {
        console.warn('getLocalEmojiUrl failed', err)
    }
    return ''
}

export const EmojiBoardWidget = () => {
    const addStickers = useStickersStore(s => s.addStickers)
    const addSticker = useStickersStore(s => s.addSticker)
    const boardRef = useRef(null)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const boardEmojis = await stickersApi.getBoard()
                if (cancelled) return

                let x = 30, y = 30
                const items = []
                for (const e of boardEmojis) {
                    const w = e.width ?? EMOJI_W
                    const h = e.height ?? EMOJI_H
                    let imageUrl = EMOJI_MAP?.[String(e.stickerId)] ?? ''
                    if (!imageUrl) imageUrl = await getLocalEmojiUrl(e.stickerId)
                    items.push({
                        id: e.id,
                        x, y,
                        color: 'transparent',
                        width: w,
                        height: h,
                        text: '',
                        type: 'emoji',
                        stickerId: e.stickerId,
                        imageUrl,
                        zIndex: 1
                    })
                    x += 24
                    y += 24
                }
                addStickers(items)
            } catch (err) {
                console.warn('EmojiBoardWidget: failed to load', err)
            }
        })()
        return () => { cancelled = true }
    }, [addStickers])

    const createEmoji = async (stickerId) => {
        try {
            const created = await stickersApi.addToBoard(
                stickerId,
                EMOJI_W,
                EMOJI_H
            )
            if (!created) return
            addSticker({
                id: String(created.id),
                x: 260,
                y: 120,
                color: 'transparent',
                width: created.width ?? EMOJI_W,
                height: created.height ?? EMOJI_H,
                type: 'emoji',
                stickerId: created.stickerId,
                imageUrl: created.imageUrl ?? '',
                zIndex: created.zIndex
            })
        } catch (err) {
            console.warn('EmojiBoardWidget: createEmoji failed', err)
        }
    }

    return (
        <div className="relative flex h-screen w-screen bg-gray-100">
            <EmojiToolbar onCreateClick={createEmoji} />
            <Board ref={boardRef} />
        </div>
    )
}

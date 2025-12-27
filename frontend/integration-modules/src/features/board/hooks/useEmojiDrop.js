// src/features/board/hooks/useEmojiDrop.js
import { stickersApi } from '../../../shared/api/stickerApi'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { EMOJI_W, EMOJI_H, BOARD_SAFE_PAD } from '../constants'

export const useEmojiDrop = () => {
    const addSticker = useStickersStore((state) => state.addSticker)
    const topZ = useStickersStore((state) => state.topZ)

    return async (e, scrollLeft, scrollTop, rect) => {
        const rawEmoji = e.dataTransfer.getData('application/x-integration-emoji')
        if (!rawEmoji) {
            return
        }

        let payload
        try {
            payload = JSON.parse(rawEmoji)
        } catch {}
        if (!payload?.id) {
            return
        }

        const w = payload.width ?? EMOJI_W
        const h = payload.height ?? EMOJI_H

        const x = Math.max(0, Math.round(scrollLeft + e.clientX - rect.left - BOARD_SAFE_PAD - w / 2))
        const y = Math.max(0, Math.round(scrollTop + e.clientY - rect.top - BOARD_SAFE_PAD - h / 2))
        const nextZ = (topZ || 1) + 1

        try {
            const saved = await stickersApi.addToBoard(payload.id, w, h)
            addSticker({
                id: saved.id,
                stickerId: saved.stickerId,
                x,
                y,
                color: 'transparent',
                width: saved.width ?? w,
                height: saved.height ?? h,
                text: '',
                zIndex: nextZ,
                imageUrl: saved.url,
            })
        } catch (err) {
            console.warn('Не удалось сохранить эмодзи на доске:', err)
            addSticker({
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                stickerId: payload.id,
                x,
                y,
                color: 'transparent',
                width: w,
                height: h,
                text: '',
                zIndex: nextZ,
                imageUrl: normalizeStickerUrl(payload.url),
            })
        }
    }
}
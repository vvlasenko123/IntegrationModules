import { stickersApi } from '../../../shared/api/stickerApi'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { EMOJI_W, EMOJI_H, BOARD_SAFE_PAD } from '../constants'

export const useEmojiDrop = () => {
    const addSticker = useStickersStore(s => s.addSticker)
    const topZ = useStickersStore(s => s.topZ)

    return async (e, scrollLeft, scrollTop, rect) => {
        const rawEmoji = e.dataTransfer.getData('application/x-integration-emoji')
        if (!rawEmoji) return

        let payload
        try {
            payload = JSON.parse(rawEmoji)
        } catch {}

        if (!payload?.id) return

        const x = Math.max(
            0,
            Math.round(scrollLeft + e.clientX - rect.left - BOARD_SAFE_PAD - EMOJI_W / 2)
        )
        const y = Math.max(
            0,
            Math.round(scrollTop + e.clientY - rect.top - BOARD_SAFE_PAD - EMOJI_H / 2)
        )

        const nextZ = (topZ || 1) + 1

        try {
            const saved = await stickersApi.addToBoard(payload.id)
            addSticker({
                id: saved.id,
                stickerId: saved.stickerId,
                x,
                y,
                color: 'transparent',
                width: EMOJI_W,
                height: EMOJI_H,
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
                width: EMOJI_W,
                height: EMOJI_H,
                text: '',
                zIndex: nextZ,
                imageUrl: payload.url,
            })
        }
    }
}

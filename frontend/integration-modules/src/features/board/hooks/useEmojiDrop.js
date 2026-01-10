import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { EMOJI_W, EMOJI_H, DND_EMOJI, BOARD_SAFE_PAD } from '../constants'
import { stickersApi } from '../../../shared/api/stickerApi'
import { EMOJI_MAP } from '../../emoji-sticker/stickers.js'
import { getInfo } from '../../../shared/utils/getInfo'

export const useEmojiDrop = () => {
    const addSticker = useStickersStore(s => s.addSticker)
    const topZ = useStickersStore(s => s.topZ)

    return async (e, scrollLeft, scrollTop, rect, user, board) => {
        const raw = e.dataTransfer.getData(DND_EMOJI)
        if (!raw) return

        let payload
        try {
            payload = JSON.parse(raw)
        } catch {
            console.warn('DND_EMOJI: bad payload')
            return
        }

        if (!payload?.stickerId) {
            console.warn('DND_EMOJI: payload missing stickerId', payload)
            return
        }

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
            const saved = await stickersApi.addToBoard(payload.stickerId)

            const info = getInfo({
                widgetId: saved.id,
                userId: user.id,
                role: user.role,
                board,
                extraConfig: { type: 'emoji', stickerId: payload.stickerId }
            })

            addSticker({
                id: saved.id,
                stickerId: payload.stickerId,
                type: 'emoji',
                x,
                y,
                width: EMOJI_W,
                height: EMOJI_H,
                zIndex: nextZ,
                color: 'transparent',
                text: '',
                imageUrl: EMOJI_MAP[payload.stickerId] || '',
                config: info,
            })
        } catch (err) {
            console.warn('Не удалось создать Emoji на доске:', err)
        }
    }
}

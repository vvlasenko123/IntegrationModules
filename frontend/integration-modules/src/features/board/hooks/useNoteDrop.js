import { notesApi } from '../../../shared/api/notesApi'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { NOTE_W, NOTE_H, BOARD_SAFE_PAD } from '../constants'

export const useNoteDrop = () => {
    const addSticker = useStickersStore(s => s.addSticker)
    const topZ = useStickersStore(s => s.topZ)

    return async (e, scrollLeft, scrollTop, rect) => {
        const rawNote = e.dataTransfer.getData('application/x-integration-note')
        if (!rawNote) return

        let color
        try {
            color = JSON.parse(rawNote)?.color
        } catch {}
        if (!color) return

        const x = Math.max(
            0,
            Math.round(scrollLeft + e.clientX - rect.left - BOARD_SAFE_PAD - NOTE_W / 2)
        )
        const y = Math.max(
            0,
            Math.round(scrollTop + e.clientY - rect.top - BOARD_SAFE_PAD - NOTE_H / 2)
        )

        const nextZ = (topZ || 1) + 1

        try {
            const created = await notesApi.create(color)
            addSticker({
                id: created.id,
                x,
                y,
                color,
                width: NOTE_W,
                height: NOTE_H,
                text: created.content ?? '',
                zIndex: nextZ,
            })
        } catch (err) {
            console.warn('Не удалось создать заметку при дропе:', err)
        }
    }
}

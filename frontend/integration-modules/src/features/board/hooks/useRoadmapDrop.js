import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { DND_ROADMAP } from '../constants'
import { roadmapApi } from '../../../shared/api/roadmapApi.js'
import { getInfo } from '../../../shared/utils/getInfo'

export const useRoadmapDrop = () => {
    const addSticker = useStickersStore(s => s.addSticker)
    const topZ = useStickersStore(s => s.topZ)

    return async (e, scrollLeft, scrollTop, rect, user, board) => {
        const raw = e.dataTransfer.getData(DND_ROADMAP)
        if (!raw) return

        const x = Math.round(scrollLeft + (e.clientX - rect.left))
        const y = Math.round(scrollTop + (e.clientY - rect.top))
        const nextZ = (topZ || 1) + 1

        try {
            const created = await roadmapApi.create({
                text: '',
                description: '',
                date: null,
                completed: false,
                cancelled: false,
                zIndex: nextZ,
                width: 200,
                height: 50,
                parentId: null
            })

            const info = getInfo({
                widgetId: created.id,
                userId: user.id,
                role: user.role,
                board,
                extraConfig: { type: 'roadmap' }
            })

            addSticker({
                id: created.id,
                type: 'roadmap',
                x,
                y,
                width: created.width ?? 200,
                height: created.height ?? 50,
                text: created.text ?? '',
                description: created.description ?? '',
                date: created.date ?? null,
                completed: created.completed ?? false,
                cancelled: created.cancelled ?? false,
                parentId: created.parentId ?? null,
                zIndex: created.zIndex ?? nextZ,
                config: info,
            })
        } catch (err) {
            console.warn('Не удалось создать roadmap при дропе:', err)
        }
    }
}

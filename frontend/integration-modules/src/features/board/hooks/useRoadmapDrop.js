import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { DND_ROADMAP } from '../constants'

export const useRoadmapDrop = () => {
    const addSticker = useStickersStore(s => s.addSticker)
    const topZ = useStickersStore(s => s.topZ)

    return (e, scrollLeft, scrollTop, rect) => {
        const raw = e.dataTransfer.getData(DND_ROADMAP)
        if (!raw) return

        const x = Math.round(scrollLeft + (e.clientX - rect.left))
        const y = Math.round(scrollTop + (e.clientY - rect.top))

        addSticker({
            id: Date.now(),
            type: 'roadmap',
            x,
            y,
            width: 200,
            height: 50,
            text: '',
            completed: false,
            cancelled: false,
            deadline: null,
            zIndex: (topZ || 1) + 1,
        })
    }
}

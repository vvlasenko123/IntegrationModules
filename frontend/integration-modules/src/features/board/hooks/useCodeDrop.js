    import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
    import { DND_CODE } from '../constants'

    export const useCodeDrop = () => {
        const addSticker = useStickersStore((s) => s.addSticker)
        const topZ = useStickersStore((s) => s.topZ)

        return (e, scrollLeft, scrollTop, rect) => {
            const dataRaw = e.dataTransfer.getData(DND_CODE)
            if (!dataRaw) return

            const x = Math.round(scrollLeft + (e.clientX - rect.left))
            const y = Math.round(scrollTop + (e.clientY - rect.top))

            addSticker({
                id: Date.now(),
                type: 'code',
                x,
                y,
                width: 600,
                height: 400,
                text: '# Markdown Preview\n\nType your code here..',
                zIndex: (topZ || 1) + 1,
            })
        }
    }
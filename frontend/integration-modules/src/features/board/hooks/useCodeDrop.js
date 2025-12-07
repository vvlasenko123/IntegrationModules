import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { DND_CODE } from '../constants'

export const useCodeDrop = () => {
    const addSticker = useStickersStore((s) => s.addSticker)
    const topZ = useStickersStore((s) => s.topZ)

    return (e, scrollLeft, scrollTop, rect) => {
        // Проверяем, есть ли данные (на всякий случай)
        const dataRaw = e.dataTransfer.getData(DND_CODE)
        if (!dataRaw) return

        // Вычисляем координаты относительно доски
        const x = Math.round(scrollLeft + (e.clientX - rect.left))
        const y = Math.round(scrollTop + (e.clientY - rect.top))

        // Добавляем стикер в хранилище
        addSticker({
            id: Date.now(),
            type: 'code', // Важно: этот тип мы ловим в Board.jsx
            x,
            y,
            width: 600,   // Стартовая ширина
            height: 400,  // Стартовая высота
            text: '# Markdown Preview\n\nType your code here...', // Текст по умолчанию
            zIndex: (topZ || 1) + 1,
        })
    }
}
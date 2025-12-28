import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { DND_MARKDOWN } from '../constants'
import { markdownApi } from '../../../shared/api/markdownApi'

export const useMarkdownDrop = () => {
    const addElement = useStickersStore(s => s.addSticker)
    const topZ = useStickersStore(s => s.topZ)

    return async (e, scrollLeft, scrollTop, rect) => {
        const dataRaw = e.dataTransfer.getData(DND_MARKDOWN)
        if (!dataRaw) {
            return
        }

        const x = Math.round(scrollLeft + (e.clientX - rect.left))
        const y = Math.round(scrollTop + (e.clientY - rect.top))

        const width = 600
        const height = 400
        const content = '# Начало работы с Markdown'

        try {
            const created = await markdownApi.create(content, width, height)
            const boardItem = await markdownApi.addToBoard(created.id, width, height)

            addElement({
                id: boardItem.id,
                stickerId: boardItem.markdownId,
                type: 'markdown',
                x,
                y,
                width: boardItem.width,
                height: boardItem.height,
                text: boardItem.content,
                zIndex: (topZ || 1) + 1,
            })
        } catch (err) {
            console.warn('Не удалось сохранить markdown:', err)
        }
    }
}

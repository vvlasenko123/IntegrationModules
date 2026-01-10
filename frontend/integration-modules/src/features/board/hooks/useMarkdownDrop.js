import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { DND_MARKDOWN } from '../constants'
import { markdownApi } from '../../../shared/api/markdownApi'
import { getInfo } from '../../../shared/utils/getInfo'

export const useMarkdownDrop = () => {
    const addElement = useStickersStore(s => s.addSticker)
    const topZ = useStickersStore(s => s.topZ)

    return async (e, scrollLeft, scrollTop, rect, user, board) => {
        const dataRaw = e.dataTransfer.getData(DND_MARKDOWN)
        if (!dataRaw) return

        const x = Math.round(scrollLeft + (e.clientX - rect.left))
        const y = Math.round(scrollTop + (e.clientY - rect.top))
        const width = 600
        const height = 400
        const content = '# Начало работы с Markdown'

        try {
            const created = await markdownApi.create(content, width, height)
            const boardItem = await markdownApi.addToBoard(created.id, width, height)

            const info = getInfo({
                widgetId: boardItem.id,
                userId: user.id,
                role: user.role,
                board,
                extraConfig: { type: 'markdown', defaultContent: content }
            })

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
                config: info,
            })

        } catch (err) {
            console.warn('Не удалось сохранить markdown:', err)
        }
    }
}

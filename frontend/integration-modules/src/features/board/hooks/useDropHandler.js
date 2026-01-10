import { useEmojiDrop } from './useEmojiDrop'
import { useShapeDrop } from './useShapeDrop'
import { useNoteDrop } from './useNoteDrop'
import { useMarkdownDrop } from './useMarkdownDrop.js'
import { useRoadmapDrop } from './useRoadmapDrop'
import { DND_EMOJI, DND_SHAPE, DND_NOTE, DND_MARKDOWN,DND_ROADMAP } from '../constants'

export const useDropHandler = () => {
    const handleEmoji = useEmojiDrop()
    const handleShape = useShapeDrop()
    const handleNote = useNoteDrop()
    const handleMarkdown = useMarkdownDrop()
    const handleRoadmap = useRoadmapDrop()

    return (e, scrollLeft, scrollTop, rect) => {
        if (!e || !e.dataTransfer) return

        const types = Array.from(e.dataTransfer.types || [])

        if (types.includes(DND_SHAPE)) return handleShape(e, scrollLeft, scrollTop, rect)
        if (types.includes(DND_EMOJI)) return handleEmoji(e, scrollLeft, scrollTop, rect)
        if (types.includes(DND_NOTE)) return handleNote(e, scrollLeft, scrollTop, rect)
        if (types.includes(DND_MARKDOWN)) return handleMarkdown(e, scrollLeft, scrollTop, rect)
        if (types.includes(DND_ROADMAP)) return handleRoadmap(e, scrollLeft, scrollTop, rect)
    }
}

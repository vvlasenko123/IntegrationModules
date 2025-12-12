import { useEmojiDrop } from './useEmojiDrop'
import { useShapeDrop } from './useShapeDrop'
import { useNoteDrop } from './useNoteDrop'
import { useCodeDrop } from './useCodeDrop'
import { DND_EMOJI, DND_SHAPE, DND_NOTE, DND_CODE } from '../constants'

export const useDropHandler = (boardRef) => {
    const handleEmoji = useEmojiDrop()
    const handleShape = useShapeDrop()
    const handleNote = useNoteDrop()
    const handleCode = useCodeDrop()

    return (e, scrollLeft, scrollTop, rect) => {
        if (!e || !e.dataTransfer) return

        const types = Array.from(e.dataTransfer.types || [])

        if (types.includes(DND_SHAPE)) return handleShape(e, scrollLeft, scrollTop, rect)
        if (types.includes(DND_EMOJI)) return handleEmoji(e, scrollLeft, scrollTop, rect)
        if (types.includes(DND_NOTE)) return handleNote(e, scrollLeft, scrollTop, rect)
        if (types.includes(DND_CODE)) return handleCode(e, scrollLeft, scrollTop, rect)
    }
}

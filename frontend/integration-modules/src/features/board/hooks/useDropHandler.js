import { useEmojiDrop } from './useEmojiDrop'
import { useShapeDrop } from './useShapeDrop'
import { useNoteDrop } from './useNoteDrop'
import { DND_EMOJI, DND_NOTE, DND_SHAPE } from '../constants'

export const useDropHandler = (boardRef) => {
    const handleEmoji = useEmojiDrop()
    const handleShape = useShapeDrop()
    const handleNote = useNoteDrop()


    return (e) => {
        if (!boardRef.current) return

        e.preventDefault()
        e.stopPropagation()

        const rect = boardRef.current.getBoundingClientRect()
        const scrollLeft = boardRef.current.scrollLeft
        const scrollTop = boardRef.current.scrollTop

        const types = e.dataTransfer.types

        if (types.includes(DND_SHAPE)) {
            handleShape(e, scrollLeft, scrollTop, rect)
        }
        else if (types.includes(DND_EMOJI)) {
            handleEmoji(e, scrollLeft, scrollTop, rect)
        }
        else if (types.includes(DND_NOTE)) {
            handleNote(e, scrollLeft, scrollTop, rect)
        }
    }
}
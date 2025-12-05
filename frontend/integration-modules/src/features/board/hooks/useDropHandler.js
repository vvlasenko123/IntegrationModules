// src/features/board/hooks/useDropHandler.js
import { useEmojiDrop } from './useEmojiDrop'
import { useNoteDrop } from './useNoteDrop'
import { DND_EMOJI, DND_NOTE } from '../constants'

export const useDropHandler = (boardRef) => {
    const handleEmoji = useEmojiDrop()
    const handleNote = useNoteDrop()

    return (e) => {
        if (!boardRef.current) return
        e.preventDefault()
        e.stopPropagation()

        const rect = boardRef.current.getBoundingClientRect()
        const scrollLeft = boardRef.current.scrollLeft
        const scrollTop = boardRef.current.scrollTop

        if (e.dataTransfer.types.includes(DND_NOTE)) {
            handleNote(e, scrollLeft, scrollTop, rect)
        } else if (e.dataTransfer.types.includes(DND_EMOJI)) {
            handleEmoji(e, scrollLeft, scrollTop, rect)
        }
    }
}
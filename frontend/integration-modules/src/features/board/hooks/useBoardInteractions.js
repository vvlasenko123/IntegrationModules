// src/features/board/hooks/useBoardInteractions.js
import { useCallback, useEffect } from 'react'
import { DND_NOTE, DND_EMOJI, DND_SHAPE, DND_MARKDOWN } from '../constants'

export function useBoardInteractions(boardRef, handleDropGlobal, selectSticker) {
    const onDragOver = useCallback((e) => {
        const types = Array.from(e.dataTransfer?.types || [])
        if ([DND_NOTE, DND_EMOJI, DND_SHAPE, DND_MARKDOWN].some(t => types.includes(t))) {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        }
    }, [])

    const onDrop = useCallback((e) => {
        const boardEl = boardRef.current
        if (!boardEl) return
        const rect = boardEl.getBoundingClientRect()
        handleDropGlobal(e, boardEl.scrollLeft, boardEl.scrollTop, rect)
    }, [boardRef, handleDropGlobal])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest?.('.react-flow__node')) {
                selectSticker(null)
            }
        }

        const boardEl = boardRef.current
        boardEl?.addEventListener('click', handleClickOutside)

        return () => {
            boardEl?.removeEventListener('click', handleClickOutside)
        }
    }, [boardRef, selectSticker])

    return { onDragOver, onDrop }
}

import { useEffect } from 'react'

export const useDragEvents = (dragRef, id, setPosition) => {
    useEffect(() => {
        const onMove = (e) => {
            if (!dragRef.current.dragging) return
            if (dragRef.current.pointerId != null && e.pointerId !== dragRef.current.pointerId) return

            const clientX = e.clientX
            const clientY = e.clientY
            if (clientX == null || clientY == null) return

            const dx = clientX - dragRef.current.startClientX
            const dy = clientY - dragRef.current.startClientY

            const nx = Math.round(dragRef.current.startStickerX + dx / (dragRef.current.scale || 1))
            const ny = Math.round(dragRef.current.startStickerY + dy / (dragRef.current.scale || 1))

            setPosition(id, Math.max(0, nx), Math.max(0, ny))
        }

        const onUp = () => {
            if (!dragRef.current.dragging) return

            try {
                if (dragRef.current.pointerId != null) {
                    // pointer capture release handled by React
                }
            } catch (err) { }

            dragRef.current.dragging = false
            dragRef.current.pointerId = null
        }

        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
        window.addEventListener('pointercancel', onUp)

        return () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
            window.removeEventListener('pointercancel', onUp)
        }
    }, [id, setPosition, dragRef])
}
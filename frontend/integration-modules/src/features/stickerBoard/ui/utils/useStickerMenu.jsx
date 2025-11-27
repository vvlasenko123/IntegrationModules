import { useState, useEffect } from 'react'

export const useStickerMenu = (id) => {
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

    const onContextMenu = (e) => {
        e.preventDefault()
        e.stopPropagation()

        let x = e.clientX
        let y = e.clientY

        const padding = 8
        const vw = window.innerWidth
        const vh = window.innerHeight
        const menuW = 140
        const menuH = 40

        if (x + menuW + padding > vw) {
            x = vw - menuW - padding
        }
        if (y + menuH + padding > vh) {
            y = vh - menuH - padding
        }

        setMenuPos({ x, y })
        setMenuVisible(true)
    }

    useEffect(() => {
        const onPointerDown = (ev) => {
            if (!menuVisible) return

            const menuEl = document.getElementById(`sticker-menu-${id}`)
            if (menuEl && !menuEl.contains(ev.target)) {
                setMenuVisible(false)
            }
        }

        const onKey = (ev) => {
            if (ev.key === 'Escape') {
                setMenuVisible(false)
            }
        }

        window.addEventListener('pointerdown', onPointerDown)
        window.addEventListener('keydown', onKey)

        return () => {
            window.removeEventListener('pointerdown', onPointerDown)
            window.removeEventListener('keydown', onKey)
        }
    }, [menuVisible, id])

    return {
        menuVisible,
        setMenuVisible,
        menuPos,
        onContextMenu
    }
}
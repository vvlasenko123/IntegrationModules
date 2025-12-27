import React, { useRef,useEffect, useContext, useState, useMemo } from 'react'
import { Resizable } from 're-resizable'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { BoardContext } from '../../board/ui/BoardContext.jsx'
import { stickersApi } from '../../../shared/api/stickerApi'
import '../../../styles/sticker.css'

export const EmojiSticker = ({ id }) => {
    const sticker = useStickersStore(s => s.stickers.find(x => x.id === id))
    if (!sticker || !sticker.imageUrl) return null

    const { setPosition, setSize, bringToFront, removeSticker } = useStickersStore()
    const boardRef = useContext(BoardContext)
    const elRef = useRef(null)
    const [hovered, setHovered] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

    const dragRef = useRef({
        dragging: false,
        pointerId: null,
        startClientX: 0,
        startClientY: 0,
        startStickerX: 0,
        startStickerY: 0,
        scale: 1
    })

    const handleStyles = useMemo(() => ({
        topLeft:     { top: -6, left: -6, width: 12, height: 12 },
        topRight:    { top: -6, right: -6, width: 12, height: 12 },
        bottomLeft:  { bottom: -6, left: -6, width: 12, height: 12 },
        bottomRight: { bottom: -6, right: -6, width: 12, height: 12 }
    }), [])

    const handleComponent = useMemo(() => ({
        topLeft:     <span className="sticker-resize-handle__dot" />,
        topRight:    <span className="sticker-resize-handle__dot" />,
        bottomLeft:  <span className="sticker-resize-handle__dot" />,
        bottomRight: <span className="sticker-resize-handle__dot" />
    }), [])

    useEffect(() => {
        const onMove = (e) => {
            if (!dragRef.current.dragging || (dragRef.current.pointerId != null && e.pointerId !== dragRef.current.pointerId)) return
            const dx = e.clientX - dragRef.current.startClientX
            const dy = e.clientY - dragRef.current.startClientY
            const nx = Math.round(dragRef.current.startStickerX + dx / (dragRef.current.scale || 1))
            const ny = Math.round(dragRef.current.startStickerY + dy / (dragRef.current.scale || 1))
            setPosition(id, Math.max(0, nx), Math.max(0, ny))
        }
        const onUp = () => { dragRef.current.dragging = false; dragRef.current.pointerId = null }
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
        window.addEventListener('pointercancel', onUp)
        return () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
            window.removeEventListener('pointercancel', onUp)
        }
    }, [id, setPosition])

    const notifyTouched = () => {
        window.dispatchEvent(new CustomEvent('sticker-touched', { detail: { id, type: 'emoji' } }))
    }

    const onPointerDown = (e) => {
        if (e.button !== 0) return
        e.preventDefault()
        e.stopPropagation()
        bringToFront(id)
        notifyTouched()

        const el = elRef.current
        const board = boardRef?.current || el?.closest('[data-board="true"]')
        const boardRect = board?.getBoundingClientRect() || el?.getBoundingClientRect()
        const scale = board ? boardRect.width / board.clientWidth : 1

        dragRef.current = {
            dragging: true,
            pointerId: e.pointerId,
            startClientX: e.clientX,
            startClientY: e.clientY,
            startStickerX: sticker.x,
            startStickerY: sticker.y,
            scale
        }
        el?.setPointerCapture?.(e.pointerId)
    }

    const onContextMenu = (e) => {
        e.preventDefault()
        e.stopPropagation()
        let x = e.clientX
        let y = e.clientY
        if (x + 140 > window.innerWidth) x = window.innerWidth - 148
        if (y + 40 > window.innerHeight) y = window.innerHeight - 48
        setMenuPos({ x, y })
        setMenuVisible(true)
    }

    const handleDelete = async () => {
        setMenuVisible(false)
        try {
            await stickersApi.removeFromBoard(id)
            removeSticker(id)
        } catch {
            alert('Не удалось удалить эмодзи')
        }
    }

    const wrapperClass = [
        'resizable-sticker-wrapper',
        'resizable-sticker-wrapper--image',
        hovered ? 'resizable-sticker-wrapper--image-active' : ''
    ].filter(Boolean).join(' ')

    return (
        <>
            <Resizable
                size={{ width: sticker.width, height: sticker.height }}
                onResizeStop={async (_, __, ref) => {
                    const w = ref.offsetWidth
                    const h = ref.offsetHeight

                    setSize(id, w, h)

                    try {
                        await stickersApi.updateBoardSize(id, w, h)
                    } catch (e) {
                        console.warn('Не удалось сохранить размер эмодзи', e)
                    }
                }}
                minWidth={30}
                minHeight={30}
                className={wrapperClass}
                style={{ position: 'absolute', left: sticker.x, top: sticker.y, zIndex: sticker.zIndex }}
                handleStyles={handleStyles}
                handleComponent={handleComponent}
                enable={{
                    top: false, right: false, bottom: false, left: false,
                    topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
                }}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
            >
                <div
                    ref={elRef}
                    className="sticker-root sticker-root--image"
                    onPointerDown={onPointerDown}
                    onContextMenu={onContextMenu}
                    style={{ background: 'transparent' }}
                >
                    <div className="sticker-content sticker-content--image">
                        <img
                            src={sticker.imageUrl}
                            alt=""
                            className="sticker-image"
                            draggable={false}
                            onPointerDown={e => e.stopPropagation()}
                        />
                    </div>
                </div>
            </Resizable>

            {menuVisible && (
                <div
                    id={`emoji-menu-${id}`}
                    className="sticker-context-menu"
                    style={{ left: menuPos.x + 'px', top: menuPos.y + 'px', position: 'fixed' }}
                    onContextMenu={e => e.preventDefault()}
                >
                    <button className="sticker-context-menu__item" onClick={handleDelete}>
                        Удалить
                    </button>
                </div>
            )}
        </>
    )
}
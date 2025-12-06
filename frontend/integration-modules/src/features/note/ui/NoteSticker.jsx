import React, { useRef, useEffect, useContext, useState } from 'react'
import { Resizable } from 're-resizable'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { BoardContext } from '../../board/ui/BoardContext.jsx'
import { notesApi } from '../../../shared/api/notesApi'
import '../../../styles/sticker.css'

export const NoteSticker = ({ id }) => {
    const sticker = useStickersStore(s => s.stickers.find(x => x.id === id))
    if (!sticker) return null

    const { setPosition, setSize, setText, bringToFront, removeSticker } = useStickersStore()

    const boardRef = useContext(BoardContext)
    const elRef = useRef(null)
    const contentRef = useRef(null)

    const dragRef = useRef({
        dragging: false,
        pointerId: null,
        startClientX: 0,
        startClientY: 0,
        startStickerX: 0,
        startStickerY: 0,
        scale: 1
    })

    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
    const [editing, setEditing] = useState(false)

    useEffect(() => {
        const el = contentRef.current
        if (!el) return

        let fontSize = 18
        el.style.fontSize = fontSize + 'px'

        const parent = el.parentElement
        if (!parent) return

        while (fontSize > 8 && (el.scrollHeight > parent.clientHeight || el.scrollWidth > parent.clientWidth)) {
            fontSize -= 0.5
            el.style.fontSize = fontSize + 'px'
        }
    }, [sticker.text, sticker.width, sticker.height])

    useEffect(() => {
        const el = contentRef.current
        if (!el) return

        if (document.activeElement === el) return

        const currentText = el.innerText.replace(/\u200B/g, '')
        if (currentText === (sticker.text || '')) return

        el.innerText = sticker.text || ''
    }, [sticker.text])

    useEffect(() => {
        const onMove = (e) => {
            if (!dragRef.current.dragging || (dragRef.current.pointerId != null && e.pointerId !== dragRef.current.pointerId)) return

            const dx = e.clientX - dragRef.current.startClientX
            const dy = e.clientY - dragRef.current.startClientY
            const nx = Math.round(dragRef.current.startStickerX + dx / (dragRef.current.scale || 1))
            const ny = Math.round(dragRef.current.startStickerY + dy / (dragRef.current.scale || 1))

            setPosition(id, Math.max(0, nx), Math.max(0, ny))
        }

        const onUp = () => {
            if (!dragRef.current.dragging) return
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
    }, [id, setPosition])

    useEffect(() => {
        if (!menuVisible) return
        const close = (e) => {
            const menu = document.getElementById(`note-menu-${id}`)
            if (menu && !menu.contains(e.target)) setMenuVisible(false)
        }
        window.addEventListener('pointerdown', close)
        return () => window.removeEventListener('pointerdown', close)
    }, [menuVisible, id])

    const notifyTouched = () => {
        window.dispatchEvent(new CustomEvent('sticker-touched', { detail: { id, type: 'note' } }))
    }

    const onRootPointerDown = (e) => {
        if (e.button !== 0) return
        if (contentRef.current?.contains(e.target)) return

        e.preventDefault()
        e.stopPropagation()
        bringToFront(id)
        notifyTouched()

        const el = elRef.current
        if (!el) return

        const board = boardRef?.current || el.closest('[data-board="true"]')
        const boardRect = board?.getBoundingClientRect() || el.getBoundingClientRect()
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

        el.setPointerCapture?.(e.pointerId)
    }

    const onContentPointerDown = (e) => {
        e.stopPropagation()
        setEditing(true)
        notifyTouched()
        setTimeout(() => {
            contentRef.current?.focus()
        }, 0)
    }

    const onInput = (e) => setText(id, e.currentTarget.innerText)

    const onBlur = async () => {
        setEditing(false)
        try {
            await notesApi.updateContent(id, sticker.text || '')
        } catch (e) {
            console.warn('Не удалось сохранить текст заметки', e)
        }
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
            await notesApi.delete(id)
            removeSticker(id)
        } catch (err) {
            alert('Не удалось удалить заметку')
        }
    }

    return (
        <>
            <Resizable
                size={{ width: sticker.width, height: sticker.height }}
                onResizeStop={(_, __, ref) => setSize(id, ref.offsetWidth, ref.offsetHeight)}
                minWidth={90}
                minHeight={60}
                style={{ position: 'absolute', left: sticker.x, top: sticker.y, zIndex: sticker.zIndex }}
                enable={{
                    top: false,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true
                }}
            >

                <div
                    ref={elRef}
                    data-sticker-id={id}
                    data-sticker-type="note"
                    className={`sticker-root ${editing ? 'sticker-root--editing' : ''}`}
                    style={{ background: sticker.color }}
                    onPointerDown={onRootPointerDown}
                    onDoubleClick={onContentPointerDown}
                    onContextMenu={onContextMenu}
                >
                    <div className="sticker-drag-header" onPointerDown={onRootPointerDown} />
                    <div className="sticker-content">
                        <div
                            ref={contentRef}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={onInput}
                            onBlur={onBlur}
                            onPointerDown={onContentPointerDown}
                            onPaste={(e) => {
                                e.preventDefault()
                                document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
                            }}
                            className="sticker-text"
                            style={{
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                color: sticker.color === '#262626' ? '#fff' : '#262626',
                                caretColor: sticker.color === '#262626' ? '#fff' : '#111',
                                outline: 0,
                            }}
                        />
                    </div>
                </div>
            </Resizable>

            {menuVisible && (
                <div
                    id={`note-menu-${id}`}
                    className="sticker-context-menu"
                    style={{ left: menuPos.x, top: menuPos.y, position: 'fixed' }}
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
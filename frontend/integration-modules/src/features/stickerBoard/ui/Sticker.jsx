import React, { useRef, useEffect, useContext, useState, useMemo } from 'react'
import { Resizable } from 're-resizable'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { BoardContext } from './Board'
import './sticker.css'
import { notesApi } from '../../../shared/api/notesApi'

export const Sticker = ({ id }) => {
    const sticker = useStickersStore((state) => state.stickers.find((s) => s.id === id))
    const setPosition = useStickersStore((state) => state.setPosition)
    const setSize = useStickersStore((state) => state.setSize)
    const removeSticker = useStickersStore((state) => state.removeSticker)
    const bringToFront = useStickersStore((state) => state.bringToFront)
    const setText = useStickersStore((state) => state.setText)

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
    const [hovered, setHovered] = useState(false)

    if (!sticker) {
        return null
    }

    const isImage = typeof sticker.imageUrl === 'string' && sticker.imageUrl.length > 0
    const showImageControls = isImage && hovered && !menuVisible

    const imageHandleStyles = useMemo(() => ({
        topLeft: { top: -6, left: -6, width: 12, height: 12 },
        topRight: { top: -6, right: -6, width: 12, height: 12 },
        bottomLeft: { bottom: -6, left: -6, width: 12, height: 12 },
        bottomRight: { bottom: -6, right: -6, width: 12, height: 12 }
    }), [])

    const imageHandleClasses = useMemo(() => ({
        topLeft: 'sticker-resize-handle',
        topRight: 'sticker-resize-handle',
        bottomLeft: 'sticker-resize-handle',
        bottomRight: 'sticker-resize-handle'
    }), [])

    const imageHandleComponent = useMemo(() => ({
        topLeft: <span className="sticker-resize-handle__dot" />,
        topRight: <span className="sticker-resize-handle__dot" />,
        bottomLeft: <span className="sticker-resize-handle__dot" />,
        bottomRight: <span className="sticker-resize-handle__dot" />
    }), [])

    const resizableClassName = [
        'resizable-sticker-wrapper',
        isImage ? 'resizable-sticker-wrapper--image' : '',
        showImageControls ? 'resizable-sticker-wrapper--image-active' : ''
    ].filter(Boolean).join(' ')

    useEffect(() => {
        if (isImage) {
            return
        }

        const el = contentRef.current
        if (!el) {
            return
        }

        if (document.activeElement !== el) {
            el.innerText = sticker.text || ''
        }

        el.style.direction = 'ltr'
        el.style.textAlign = 'left'

        try {
            el.spellcheck = false
        } catch (e) { }
    }, [sticker?.id, isImage])

    useEffect(() => {
        if (isImage) {
            return
        }

        const el = contentRef.current
        if (!el) {
            return
        }

        const domText = el.innerText
        const stateText = sticker.text || ''

        if (domText !== stateText && document.activeElement !== el) {
            el.innerText = stateText
        }

        try {
            el.spellcheck = false
        } catch (e) { }
    }, [sticker?.text, isImage])

    useEffect(() => {
        if (isImage) return;

        const el = contentRef.current;
        if (!el) return;

        const MIN = 6;
        let fontSize = 18;

        el.style.fontSize = fontSize + 'px';

        const parent = el.parentElement;
        if (!parent) return;

        while (fontSize > MIN && (el.scrollHeight > parent.clientHeight || el.scrollWidth > parent.clientWidth)) {
            fontSize -= 1;
            el.style.fontSize = fontSize + 'px';
        }

    }, [sticker.text, sticker.width, sticker.height, isImage]);

    useEffect(() => {
        const onMove = (e) => {
            if (!dragRef.current.dragging) {
                return
            }
            if (dragRef.current.pointerId != null && e.pointerId !== dragRef.current.pointerId) {
                return
            }

            const clientX = e.clientX
            const clientY = e.clientY
            if (clientX == null || clientY == null) {
                return
            }

            const dx = clientX - dragRef.current.startClientX
            const dy = clientY - dragRef.current.startClientY

            const nx = Math.round(dragRef.current.startStickerX + dx / (dragRef.current.scale || 1))
            const ny = Math.round(dragRef.current.startStickerY + dy / (dragRef.current.scale || 1))

            setPosition(id, Math.max(0, nx), Math.max(0, ny))
        }

        const onUp = () => {
            if (!dragRef.current.dragging) {
                return
            }
            try {
                const el = elRef.current
                if (el && dragRef.current.pointerId != null && el.releasePointerCapture) {
                    el.releasePointerCapture(dragRef.current.pointerId)
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
    }, [id, setPosition])

    useEffect(() => {
        const onPointerDown = (ev) => {
            if (!menuVisible) {
                return
            }
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

    const onRootPointerDown = (e) => {
        if (e.button !== 0) {
            return
        }

        if (!isImage) {
            if (contentRef.current && contentRef.current.contains(e.target)) {
                return
            }
        }

        e.preventDefault()
        e.stopPropagation()
        bringToFront(id)

        const el = elRef.current
        if (!el) {
            return
        }

        const board = (boardRef && boardRef.current) ? boardRef.current : (el.closest ? el.closest('[data-board="true"]') : null)
        const boardRect = board ? board.getBoundingClientRect() : el.getBoundingClientRect()
        const clientWidth = board ? (board.clientWidth || boardRect.width) : boardRect.width
        const scale = clientWidth ? (boardRect.width / clientWidth) : 1

        dragRef.current.dragging = true
        dragRef.current.pointerId = e.pointerId
        dragRef.current.startClientX = e.clientX
        dragRef.current.startClientY = e.clientY
        dragRef.current.startStickerX = sticker.x
        dragRef.current.startStickerY = sticker.y
        dragRef.current.scale = scale || 1

        try {
            if (el.setPointerCapture) {
                el.setPointerCapture(e.pointerId)
            }
        } catch (err) { }
    }

    const onContentPointerDown = (e) => {
        if (isImage) {
            return
        }

        e.stopPropagation()
        setEditing(true)

        setTimeout(() => {
            const el = contentRef.current
            if (!el) {
                return
            }

            el.focus()
            const range = document.createRange()
            range.selectNodeContents(el)
            range.collapse(false)
            const sel = window.getSelection()
            sel.removeAllRanges()
            sel.addRange(range)
        }, 0)
    }

    const onDoubleClick = (e) => {
        if (isImage) {
            return
        }

        e.stopPropagation()
        setEditing(true)

        setTimeout(() => {
            const el = contentRef.current
            if (!el) {
                return
            }
            el.focus()
            const range = document.createRange()
            range.selectNodeContents(el)
            range.collapse(false)
            const sel = window.getSelection()
            sel.removeAllRanges()
            sel.addRange(range)
        }, 0)
    }

    const onDragStart = (e) => {
        e.preventDefault()
    }

    const onResizeStop = (e, dir, ref, delta) => {
        const w = ref.offsetWidth
        const h = ref.offsetHeight
        setSize(id, w, h)
    }

    const onInput = (e) => {
        if (isImage) {
            return
        }
        const text = e.currentTarget.innerText
        setText(id, text)
    }

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

    const handleDelete = () => {
        setMenuVisible(false)
        removeSticker(id)
    }

    const onPaste = (e) => {
        e.preventDefault();

        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };

    const onContentBlur = async () => {
        setEditing(false)

        if (isImage) {
            return
        }

        try {
            if (contentRef.current) {
                contentRef.current.spellcheck = false
            }
        } catch (e) { }

        try {
            await notesApi.updateContent(id, sticker.text || '')
        } catch (e) {
            console.warn('Не удалось сохранить текст заметки:', e)
        }
    }

    const background = isImage ? 'transparent' : sticker.color

    return (
        <>
            <Resizable
                size={{ width: sticker.width, height: sticker.height }}
                onResizeStop={onResizeStop}
                minWidth={isImage ? 30 : 90}
                minHeight={isImage ? 30 : 60}
                className={resizableClassName}
                style={{ position: 'absolute', left: sticker.x, top: sticker.y, zIndex: sticker.zIndex }}
                onPointerEnter={() => { setHovered(true) }}
                onPointerLeave={() => { setHovered(false) }}
                enable={isImage ? {
                    top: false,
                    right: false,
                    bottom: false,
                    left: false,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true
                } : {
                    top: false,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true
                }}
                handleStyles={isImage ? imageHandleStyles : undefined}
                handleClasses={isImage ? imageHandleClasses : undefined}
                handleComponent={isImage ? imageHandleComponent : undefined}
            >
                <div
                    ref={elRef}
                    className={`sticker-root ${(!isImage && editing) ? 'sticker-root--editing' : ''} ${isImage ? 'sticker-root--image' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation() }}
                    draggable={false}
                    onDragStart={onDragStart}
                    style={{ background }}
                    onContextMenu={onContextMenu}
                    onPointerDown={onRootPointerDown}
                    onDoubleClick={onDoubleClick}
                >
                    <div className={`sticker-content ${isImage ? 'sticker-content--image' : ''}`}>
                        {!isImage && (
                            <div
                                ref={contentRef}
                                contentEditable
                                onPaste={onPaste}
                                suppressContentEditableWarning
                                spellCheck={false}
                                autoCorrect="off"
                                autoCapitalize="off"
                                data-gramm="false"
                                onInput={onInput}
                                onPointerDown={onContentPointerDown}
                                onBlur={onContentBlur}
                                className="sticker-text"
                                style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    color: sticker.color === '#262626' ? '#fff' : '#262626',
                                    caretColor: sticker.color === '#262626' ? '#fff' : '#111',
                                    outline: 0,
                                }}
                            />
                        )}

                        {isImage && (
                            <img
                                src={sticker.imageUrl}
                                alt=""
                                className="sticker-image"
                                draggable={false}
                                onPointerDown={(e) => { e.stopPropagation() }}
                            />
                        )}
                    </div>
                </div>
            </Resizable>

            {menuVisible && (
                <div
                    id={`sticker-menu-${id}`}
                    className="sticker-context-menu"
                    style={{ left: `${menuPos.x}px`, top: `${menuPos.y}px`, position: 'fixed' }}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <button className="sticker-context-menu__item" onClick={handleDelete}>
                        Удалить
                    </button>
                </div>
            )}
        </>
    )
}
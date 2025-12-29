import React, { useRef, useEffect, useState } from 'react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { notesApi } from '../../../shared/api/notesApi'
import { Handle, Position, NodeResizer } from '@xyflow/react'
import '../../../styles/sticker.css'
import '@xyflow/react/dist/style.css'

export const NoteNode = ({ id, selected }) => {
    const sticker = useStickersStore(s =>
        s.stickers.find(x => String(x.id) === String(id))
    )

    const updateSticker = useStickersStore(s => s.updateSticker)
    const { setText, bringToFront, removeSticker } = useStickersStore()

    const [localText, setLocalText] = useState('')
    const contentRef = useRef(null)
    const [editing, setEditing] = useState(false)

    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })


    const fitText = () => {
        const el = contentRef.current
        if (!el) return
        const parent = el.parentElement
        if (!parent) return

        let fontSize = 18
        el.style.fontSize = fontSize + 'px'

        while (
            fontSize > 8 &&
            (el.scrollHeight > parent.clientHeight || el.scrollWidth > parent.clientWidth)
            ) {
            fontSize -= 0.5
            el.style.fontSize = fontSize + 'px'
        }
    }

    useEffect(() => {
        const el = contentRef.current
        if (!el) return
        const parent = el.parentElement
        if (!parent) return

        requestAnimationFrame(fitText)
        const ro = new ResizeObserver(() => requestAnimationFrame(fitText))
        ro.observe(parent)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        if (!sticker || editing) return
        const el = contentRef.current
        if (!el) return

        const current = el.innerText.replace(/\u200B/g, '')
        const newText = localText // используем localText, а не sticker.text

        if (current !== newText) el.innerText = newText
    }, [localText, editing])

    useEffect(() => {
        if (!sticker) return
        setLocalText(sticker.text || '')
    }, [sticker?.id])


    const notifyTouched = () => {
        window.dispatchEvent(
            new CustomEvent('sticker-touched', { detail: { id, type: 'note' } })
        )
    }

    const onInput = (e) => {
        setLocalText(e.currentTarget.innerText)
        requestAnimationFrame(fitText)
    }

    const onBlur = async () => {
        setEditing(false)
        setText(id, localText) // сохраняем в Zustand
        try {
            await notesApi.updateContent(id, localText) // сохраняем на сервере
        } catch {}
    }


    const onPaste = (e) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
    }

    // ПКМ — открытие контекстного меню
    const handleContextMenu = (e) => {
        e.preventDefault()
        bringToFront(id)
        setMenuVisible(true)
        setMenuPos({ x: e.clientX, y: e.clientY })
    }

    const handleDelete = async () => {
        setMenuVisible(false)
        try {
            await notesApi.delete(id)
            removeSticker(id)
        } catch {
            alert('Не удалось удалить заметку')
        }
    }

    // Закрыть меню при клике вне
    useEffect(() => {
        const handleClickOutside = () => setMenuVisible(false)
        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [])
    if (!sticker) return null
    return (
        <div
            className={`resizable-sticker-wrapper ${selected ? 'resizable-sticker-wrapper--active' : ''}`}
            style={{ width: '100%', height: '100%', position: 'relative' }}
            onPointerDown={(e) => {
                if (e.button !== 0) return
                bringToFront(id)
                notifyTouched()
            }}
            onContextMenu={handleContextMenu} // ПКМ
        >
            <div
                className={`sticker-root ${editing ? 'sticker-root--editing' : ''}`}
                style={{
                    width: '100%',
                    height: '100%',
                    background: sticker.color,
                    position: 'relative',
                    transition: 'box-shadow 0.2s'
                }}
            >
                <Handle type="target" position={Position.Left} />
                <div
                    ref={contentRef}
                    contentEditable={editing}
                    suppressContentEditableWarning
                    onInput={onInput}
                    onBlur={() => { setEditing(false); onBlur() }}
                    onPointerDown={(e) => {
                        e.stopPropagation()
                        bringToFront(id)
                        notifyTouched()

                        if (!editing) return


                        contentRef.current?.focus()
                        const range = document.caretRangeFromPoint
                            ? document.caretRangeFromPoint(e.clientX, e.clientY)
                            : document.caretPositionFromPoint
                                ? (() => {
                                    const pos = document.caretPositionFromPoint(e.clientX, e.clientY)
                                    const r = document.createRange()
                                    r.setStart(pos.offsetNode, pos.offset)
                                    r.collapse(true)
                                    return r
                                })()
                                : null

                        if (range) {
                            const sel = window.getSelection()
                            sel.removeAllRanges()
                            sel.addRange(range)
                        }
                    }}
                    onDoubleClick={(e) => {
                        e.stopPropagation()
                        setEditing(true)
                        setTimeout(() => {
                            contentRef.current?.focus()
                            const sel = window.getSelection()
                            sel.selectAllChildren(contentRef.current)
                            sel.collapseToEnd()
                        }, 0)
                    }}
                    onPaste={onPaste}
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: 6,
                        boxSizing: 'border-box',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        outline: 0,
                        color: sticker.color === '#262626' ? '#fff' : '#262626',
                        caretColor: sticker.color === '#262626' ? '#fff' : '#111',
                        cursor: editing ? 'text' : 'default'
                    }}
                />
                <Handle type="source" position={Position.Right} />
                <NodeResizer
                    isVisible={selected}
                    minWidth={80}
                    minHeight={60}
                    onResizeEnd={async (_, params) => {
                        const w = Math.max(1, Math.round(params.width))
                        const h = Math.max(1, Math.round(params.height))
                        updateSticker(id, { width: w, height: h })
                        try { await notesApi.updateSize(id, w, h) } catch {}
                    }}
                />
            </div>

            {menuVisible && (
                <div
                    style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        padding: 2,
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <button
                        style={{
                            border: 'none',
                            background: 'none',
                            padding: '3px 7px',
                            cursor: 'pointer',
                            fontSize: 12,
                            color: '#3c3c3c'
                        }}
                        onClick={handleDelete}
                    >
                        Удалить
                    </button>
                </div>
            )}

        </div>
    )
}

import React, { useRef, useEffect, useContext, useState } from 'react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { notesApi } from '../../../shared/api/notesApi'
import { Handle, Position, NodeResizer } from '@xyflow/react'
import '../../../styles/sticker.css'
import '@xyflow/react/dist/style.css';

export const NoteNode = ({ id, data, selected }) => {
    const sticker = useStickersStore(s =>
        s.stickers.find(x => String(x.id) === String(id))
    )
    if (!sticker) return null

    const updateSticker = useStickersStore(s => s.updateSticker)
    const { setText, bringToFront, removeSticker } = useStickersStore()

    const [localText, setLocalText] = useState(sticker.text || '')
    const contentRef = useRef(null)
    const [editing, setEditing] = useState(false)

    const fitText = () => {
        const el = contentRef.current
        if (!el) return

        const parent = el.parentElement
        if (!parent) return

        let fontSize = 18
        el.style.fontSize = fontSize + 'px'

        while (
            fontSize > 8 &&
            (el.scrollHeight > parent.clientHeight ||
                el.scrollWidth > parent.clientWidth)
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

        const ro = new ResizeObserver(() => {
            requestAnimationFrame(fitText)
        })

        ro.observe(parent)

        return () => ro.disconnect()
    }, [])


    useEffect(() => {
        if (editing) return
        const el = contentRef.current
        if (!el) return

        const current = el.innerText.replace(/\u200B/g, '')
        const newText = sticker.text || ''

        if (current !== newText) {
            el.innerText = newText
        }
    }, [sticker.text, editing])

    useEffect(() => {
        if (editing) {
            setLocalText(sticker.text || '')
        }
    }, [editing])

    const notifyTouched = () => {
        window.dispatchEvent(
            new CustomEvent('sticker-touched', {
                detail: { id, type: 'note' }
            })
        )
    }

    const onInput = (e) => {
        setLocalText(e.currentTarget.innerText)
        requestAnimationFrame(fitText)
    }

    const onBlur = async () => {
        setEditing(false)
        setText(id, localText)

        try {
            await notesApi.updateContent(id, localText)
        } catch {}
    }

    const onDoubleClick = (e) => {
        e.stopPropagation()
        setEditing(true)
        setTimeout(() => contentRef.current?.focus(), 0)
    }

    const onPaste = (e) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
    }

    const setCaretToClick = (el, clientX, clientY) => {
        const range = document.caretRangeFromPoint
            ? document.caretRangeFromPoint(clientX, clientY)
            : document.caretPositionFromPoint
                ? (() => {
                    const pos = document.caretPositionFromPoint(clientX, clientY)
                    const r = document.createRange()
                    r.setStart(pos.offsetNode, pos.offset)
                    r.collapse(true)
                    return r
                })()
                : null

        if (!range) return
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
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

    return (
        <div
            className={`resizable-sticker-wrapper ${selected ? 'resizable-sticker-wrapper--active' : ''}`}
            style={{ width: '100%', height: '100%', position: 'relative' }}
            onPointerDown={(e) => {
                if (e.button !== 0) return
                bringToFront(id)
                notifyTouched()
            }}
        >
            <div
                className={`sticker-root ${editing ? 'sticker-root--editing' : ''}`}
                style={{
                    width: '100%',
                    height: '100%',
                    background: sticker.color,
                    position: 'relative'
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

                        try {
                            await notesApi.updateSize(id, w, h)
                        } catch (e) {
                            console.warn('Не удалось сохранить размер заметки', e)
                        }
                    }}
                />
            </div>
        </div>
    )
}

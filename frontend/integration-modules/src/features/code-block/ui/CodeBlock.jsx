import React, { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Draggable from 'react-draggable'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'

export const CodeBlock = ({ id }) => {
    // Получаем данные стикера из стора
    const sticker = useStickersStore((s) => s.stickers.find((item) => item.id === id))
    const updateSticker = useStickersStore((s) => s.updateSticker)
    const removeSticker = useStickersStore((s) => s.removeSticker)
    const topZ = useStickersStore((s) => s.topZ)
    
    const nodeRef = useRef(null)

    if (!sticker) return null

    // Обработчик конца перетаскивания
    const onStop = (e, data) => {
        updateSticker(id, { x: data.x, y: data.y })
    }

    // Поднятие наверх при клике
    const onMouseDown = () => {
        if (sticker.zIndex !== (topZ || 0) + 1) {
            updateSticker(id, { zIndex: (topZ || 1) + 1 })
        }
    }

    const handleTextChange = (e) => {
        updateSticker(id, { text: e.target.value })
    }

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".card-header"
            position={{ x: sticker.x, y: sticker.y }}
            onStop={onStop}
            onMouseDown={onMouseDown}
        >
            <div ref={nodeRef} style={{...styles.card, zIndex: sticker.zIndex}}>
                {/* Header */}
                <div className="card-header" style={styles.header}>
                    <span style={{ fontWeight: 600 }}>Markdown</span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); removeSticker(id) }} 
                        style={styles.closeBtn}
                    >✕</button>
                </div>

                {/* Body */}
                <div style={styles.body}>
                    {/* Editor */}
                    <div style={styles.editor}>
                        <textarea
                            value={sticker.text || ''}
                            onChange={handleTextChange}
                            placeholder="Type markdown..."
                            style={styles.textarea}
                            onPointerDown={(e) => e.stopPropagation()} // Важно: чтобы не тащилась доска
                        />
                    </div>

                    {/* Preview */}
                    <div style={styles.preview}>
                        <ReactMarkdown children={sticker.text || ''} remarkPlugins={[remarkGfm]} />
                    </div>
                </div>
            </div>
        </Draggable>
    )
}
const styles = {
    card: {
        position: 'absolute',
        width: '600px',
        height: '400px',
        backgroundColor: '#050038',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        border: '1px solid #1a1a2e'
    },
    header: {
        height: '36px',
        backgroundColor: '#020024',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 12px',
        color: '#fff',
        cursor: 'grab',
        flexShrink: 0,
        fontSize: '13px'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#888',
        cursor: 'pointer',
        fontSize: '16px'
    },
    body: {
        display: 'flex',
        flexGrow: 1,
        minHeight: 0,
        backgroundColor: '#050038'
    },
    editor: {
        width: '50%',
        borderRight: '1px solid #333',
        display: 'flex'
    },
    textarea: {
        width: '100%',
        height: '100%',
        backgroundColor: '#050038',
        color: '#a4b1cd',
        border: 'none',
        resize: 'none',
        padding: '15px',
        fontFamily: 'monospace',
        fontSize: '14px',
        outline: 'none'
    },
    preview: {
        width: '50%',
        height: '100%',
        backgroundColor: '#fff',
        color: '#333',
        padding: '15px',
        overflowY: 'auto',
        wordWrap: 'break-word',
        wordBreak: 'break-word'
    }
}
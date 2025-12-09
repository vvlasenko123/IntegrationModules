import React, { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Draggable from 'react-draggable'
import '../markdown.css'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'

export const CodeBlock = ({ id }) => {
    const sticker = useStickersStore((s) =>
        s.stickers.find((item) => item.id === id)
    )

    const updateSticker = useStickersStore((s) => s.updateSticker)
    const removeSticker = useStickersStore((s) => s.removeSticker)
    const topZ = useStickersStore((s) => s.topZ)

    const nodeRef = useRef(null)

    const [isEditorVisible, setIsEditorVisible] = useState(true)

    if (!sticker) return null

    const onStop = (e, data) => {
        updateSticker(id, { x: data.x, y: data.y })
    }

    const onMouseDown = () => {
        if (sticker.zIndex !== (topZ || 0) + 1) {
            updateSticker(id, { zIndex: (topZ || 1) + 1 })
        }
    }

    const handleTextChange = (e) => {
        updateSticker(id, { text: e.target.value })
    }

    const startResize = (e) => {
        e.stopPropagation()
        const startX = e.clientX
        const startY = e.clientY
        const startWidth = sticker.width
        const startHeight = sticker.height

        const onMove = (moveEvent) => {
            const newWidth = Math.max(300, startWidth + (moveEvent.clientX - startX))
            const newHeight = Math.max(200, startHeight + (moveEvent.clientY - startY))

            updateSticker(id, {
                width: newWidth,
                height: newHeight,
            })
        }

        const onUp = () => {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', onUp)
        }

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)
    }

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".cb-header"
            position={{ x: sticker.x, y: sticker.y }}
            onStop={onStop}
            onMouseDown={onMouseDown}
        >
            <div
                ref={nodeRef}
                className="cb-card"
                style={{
                    zIndex: sticker.zIndex,
                    width: sticker.width,
                    height: sticker.height,
                }}
            >

                <div className="cb-header">
                    <span className="cb-title">Markdown</span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className="cb-toggle"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsEditorVisible((v) => !v)
                            }}
                        >
                            {isEditorVisible ? 'Скрыть редактор' : 'Показать редактор'}
                        </button>

                        <button
                            className="cb-close"
                            onClick={(e) => {
                                e.stopPropagation()
                                removeSticker(id)
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="cb-body">
                    {isEditorVisible && (
                        <div className="cb-editor">
                            <textarea
                                value={sticker.text || ''}
                                onChange={handleTextChange}
                                placeholder="Type markdown..."
                                className="cb-textarea"
                                onPointerDown={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    <div
                        className="cb-preview"
                        style={{ width: isEditorVisible ? '50%' : '100%' }}
                    >
                        <ReactMarkdown children={sticker.text || ''} remarkPlugins={[remarkGfm]} />
                    </div>
                </div>

                <div className="cb-resizer" onMouseDown={startResize} />
            </div>
        </Draggable>
    )
}

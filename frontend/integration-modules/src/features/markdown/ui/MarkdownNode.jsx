import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { NodeResizer, Handle, Position } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import '../markdown.css'

export const MarkdownNode = ({ id, data, selected }) => {
    const sticker = useStickersStore(s =>
        s.stickers.find(x => x.id === data.stickerId)
    )
    const [draft, setDraft] = useState(sticker.text || '')
    if (!sticker) return null

    const { updateSticker, removeSticker, bringToFront, topZ } = useStickersStore()

    const [isEditorVisible, setIsEditorVisible] = useState(true)
    const selectedId = useStickersStore(s => s.selectedId)
    const handleTextChange = (e) =>
        updateSticker(sticker.id, { text: e.target.value })

    const onPointerDown = () => {
        if (sticker.zIndex !== (topZ || 0) + 1) {
            updateSticker(sticker.id, { zIndex: (topZ || 1) + 1 })
        }
        bringToFront(sticker.id)
    }



    return (
        <div
            onPointerDown={onPointerDown}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                zIndex: sticker.zIndex,
                padding: 0,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 6,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Handle type="target" position={Position.Left} className="z-100000" />
            <Handle type="source" position={Position.Right} className="z-100000" />

            <div className="cb-header">
                <span className="cb-title">Markdown</span>
                <div>
                    <button
                        className="cb-toggle"
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsEditorVisible(v => !v)
                        }}
                    >
                        {isEditorVisible ? 'Скрыть редактор' : 'Показать редактор'}
                    </button>

                    <button
                        className="cb-close"
                        onClick={(e) => {
                            e.stopPropagation()
                            removeSticker(sticker.id)
                        }}
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="cb-body" style={{ display: 'flex', flex: 1, height: '100%' }}>
                {isEditorVisible && (
                    <div
                        className="cb-editor"
                        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                    >
                        <textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Type markdown..."
                            onBlur={() => updateSticker(sticker.id, { text: draft })}
                            className="cb-textarea"
                            style={{
                                flex: 1,
                                resize: 'none',
                                fontFamily: 'monospace',
                                padding: 8,
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                <div
                    className="cb-preview"
                    style={{
                        flex: isEditorVisible ? 1 : 2,
                        overflow: 'auto',
                        padding: 8,
                    }}
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {draft}
                    </ReactMarkdown>
                </div>
            </div>

            <NodeResizer
                isVisible={selectedId === sticker.id}
                minWidth={300}
                minHeight={200}

            />
        </div>
    )
}

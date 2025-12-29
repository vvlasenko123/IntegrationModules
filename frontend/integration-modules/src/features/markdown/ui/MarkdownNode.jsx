import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { NodeResizer, Handle, Position } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import '../markdown.css'

export const MarkdownNode = ({ data}) => {
    const sticker = useStickersStore(s =>
        s.stickers.find(x => x.id === data.stickerId)
    )


    const { updateSticker, removeSticker, bringToFront, topZ, selectedId } =
        useStickersStore()

    const [draft, setDraft] = useState(sticker.text || '')
    const [isEditorVisible, setIsEditorVisible] = useState(true)

    const onPointerDown = () => {
        if (sticker.zIndex !== (topZ || 0) + 1) {
            updateSticker(sticker.id, { zIndex: (topZ || 1) + 1 })
        }
        bringToFront(sticker.id)
    }
    if (!sticker) return null

    return (
        <div
            className="cb-card"
            style={{ zIndex: sticker.zIndex }}
            onPointerDown={onPointerDown}
        >
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />

            <div className="cb-header">
                <span className="cb-title">Markdown</span>

                <div className="cb-header-actions">
                    <div className="cb-help">
                        ?
                        <div className="cb-help-tooltip">
                            <div><b># Заголовок</b></div>
                            <div><b>**жирный**</b>, <i>*курсив*</i></div>
                            <div>~~зачёркнутый~~</div>
                            <div>- список</div>
                            <div>1. нумерованный</div>
                            <div>`код` или ```блок```</div>
                            <div>[текст](ссылка)</div>
                            <div>Новая строка — Enter</div>
                        </div>
                    </div>

                    <button
                        className="cb-toggle"
                        onClick={e => {
                            e.stopPropagation()
                            setIsEditorVisible(v => !v)
                        }}
                    >
                        {isEditorVisible ? 'Скрыть редактор' : 'Показать редактор'}
                    </button>

                    <button
                        className="cb-close"
                        onClick={e => {
                            e.stopPropagation()
                            removeSticker(sticker.id)
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
                            className="cb-textarea"
                            value={draft}
                            onChange={e => setDraft(e.target.value)}
                            onBlur={() =>
                                updateSticker(sticker.id, { text: draft })
                            }
                            placeholder="Type markdown..."
                            onPointerDown={e => e.stopPropagation()}
                        />
                    </div>
                )}

                <div
                    className={`cb-preview ${
                        isEditorVisible ? '' : 'cb-preview-full'
                    }`}
                >
                    <div className="cb-preview-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {draft}
                        </ReactMarkdown>
                    </div>
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

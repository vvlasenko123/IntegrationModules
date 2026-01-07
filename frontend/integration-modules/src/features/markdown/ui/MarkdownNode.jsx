import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Handle, NodeResizer, Position } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { markdownApi } from '../../../shared/api/markdownApi'
import '../markdown.css'

export const MarkdownNode = ({ data}) => {
    const sticker = useStickersStore(s =>
        s.stickers.find(x => x.id === data.stickerId)
    )


    const { updateSticker, removeSticker, bringToFront, topZ, selectedId } =
        useStickersStore()

    const [draft, setDraft] = useState(sticker?.text || '')
    const [isEditorVisible, setIsEditorVisible] = useState(sticker?.isEditorVisible ?? true)

    const pendingSaveRef = useRef(false)
    const pendingDraftRef = useRef('')
    const savingRef = useRef(false)
    const markdownIdRef = useRef(sticker?.stickerId)

    useEffect(() => {
        if (!sticker) {
            return
        }

        setDraft(sticker.text || '')
        setIsEditorVisible(sticker.isEditorVisible ?? true)
    }, [sticker?.id])

    useEffect(() => {
        if (!sticker) {
            return
        }

        setIsEditorVisible(sticker.isEditorVisible ?? true)
    }, [sticker?.isEditorVisible])

    useEffect(() => {
        if (!sticker) return
        flushPendingContent()
    }, [sticker?.stickerId])

    useEffect(() => {
        if (sticker?.stickerId) {
            markdownIdRef.current = sticker.stickerId
        }
    }, [sticker?.stickerId])

    const getMarkdownId = () => markdownIdRef.current

    const onPointerDown = (e) => {
        if (!sticker) {
            return
        }

        if (e.target?.closest?.('.react-flow__resize-control')) {
            return
        }

        if (sticker.zIndex !== (topZ || 0) + 1) {
            updateSticker(sticker.id, { zIndex: (topZ || 1) + 1 })
        }

        bringToFront(sticker.id)
    }
    if (!sticker) return null

    const flushPendingContent = async () => {
        if (!pendingSaveRef.current) {
            return
        }

        const markdownId = getMarkdownId()
        if (!markdownId) {
            return
        }

        if (savingRef.current) {
            return
        }

        savingRef.current = true
        pendingSaveRef.current = false

        try {
            await markdownApi.updateContent(markdownId, pendingDraftRef.current)
        } catch (err) {
            console.warn('Не удалось обновить markdown:', err)
        } finally {
            savingRef.current = false
        }
    }



    const saveContent = async () => {
        if (!sticker) {
            return
        }

        updateSticker(sticker.id, { text: draft })

        const markdownId = getMarkdownId()
        if (!markdownId) {
            pendingSaveRef.current = true
            pendingDraftRef.current = draft
            console.warn('MarkdownId не задан для элемента на доске:', sticker.id)
            return
        }

        try {
            await markdownApi.updateContent(markdownId, draft)
        } catch (err) {
            console.warn('Не удалось обновить markdown:', err)
        }
    }

    const saveSize = async (w, h) => {
        if (!sticker) {
            return
        }

        updateSticker(sticker.id, { width: w, height: h })

        try {
            await markdownApi.updateBoardSize(sticker.id, w, h)
        } catch (err) {
            console.warn('Не удалось обновить размер markdown:', err)
        }
    }

    const toggleEditor = async () => {
        if (!sticker) {
            return
        }

        const next = !isEditorVisible

        setIsEditorVisible(next)
        updateSticker(sticker.id, { isEditorVisible: next })

        try {
            await markdownApi.updateBoardEditorState(sticker.id, next)
        } catch (err) {
            console.warn('Не удалось сохранить состояние редактора markdown:', err)
        }
    }

    const deleteItem = async () => {
        if (!sticker) return

        const markdownId = getMarkdownId()

        try {
            await markdownApi.deleteBoard(sticker.id)

            if (markdownId) {
                await markdownApi.deleteById(markdownId)
            } else {
                console.warn('MarkdownId не задан при удалении:', sticker.id)
            }
        } catch (err) {
            console.warn('Не удалось удалить markdown:', err)
        } finally {
            removeSticker(sticker.id)
        }
    }

    if (!sticker) {
        return null
    }

    return (
        <div
            className="cb-card"
            style={{ zIndex: sticker.zIndex, width: sticker.width, height: sticker.height }}
            onPointerDown={onPointerDown}
        >
            <NodeResizer
                className="nodrag nopan"
                isVisible={selectedId === sticker.id}
                minWidth={300}
                minHeight={200}
                resizeHandles={[
                    'top',
                    'right',
                    'bottom',
                    'left',
                    'topRight',
                    'topLeft',
                    'bottomRight',
                    'bottomLeft'
                ]}
                onResizeEnd={async (_, params) => {
                    const w = Math.max(1, Math.round(Number(params.width) || 1))
                    const h = Math.max(1, Math.round(Number(params.height) || 1))
                    await saveSize(w, h)
                }}
            />

            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />

            <div className="cb-header cb-drag-handle">
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
                            <div>Новая строка — 2 пробела + Enter</div>
                        </div>
                    </div>

                    <button
                        className="cb-toggle"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleEditor()
                        }}
                    >
                        {isEditorVisible ? 'Скрыть редактор' : 'Показать редактор'}
                    </button>

                    <button
                        className="cb-close"
                        onClick={async (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            await deleteItem()
                        }}
                    >
                        ✕
                    </button>
                </div>

            </div>

            <div className="cb-body nodrag nopan">
                {isEditorVisible && (
                    <div className="cb-editor">
                        <textarea
                            className="cb-textarea"
                            value={draft}
                            onChange={(e) => {
                                setDraft(e.target.value)
                            }}
                            onBlur={async () => {
                                await saveContent()
                            }}
                            placeholder="Type markdown..."
                        />
                    </div>
                )}

                <div className={`cb-preview ${isEditorVisible ? '' : 'cb-preview-full'}`}>
                    <div className="cb-preview-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {draft}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    )
}

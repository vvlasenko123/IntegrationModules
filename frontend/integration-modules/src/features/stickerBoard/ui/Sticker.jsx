import React, { useRef, useContext, useMemo, useState } from 'react'
import { Resizable } from 're-resizable'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import './sticker.css'
import { notesApi } from '../../../shared/api/notesApi'
import { getContrastColorForBackground } from './utils/colorUtils.jsx'
import {
    imageHandleStyles,
    imageHandleClasses,
    imageHandleComponent
} from './utils/resizeHandles'
import { useStickerDrag } from './utils/useStickerDrag'
import { useStickerContent } from './utils/useStickerContent'
import { useStickerMenu } from './utils/useStickerMenu'
import { useDragEvents } from './utils/useDragEvents'

export const Sticker = ({ id }) => {
    const sticker = useStickersStore((state) => state.stickers.find((s) => s.id === id))
    const setPosition = useStickersStore((state) => state.setPosition)
    const setSize = useStickersStore((state) => state.setSize)
    const removeSticker = useStickersStore((state) => state.removeSticker)
    const bringToFront = useStickersStore((state) => state.bringToFront)
    const setText = useStickersStore((state) => state.setText)

    const elRef = useRef(null)
    const contentRef = useRef(null)
    const [hovered, setHovered] = useState(false)

    if (!sticker) {
        return null
    }

    const isImage = typeof sticker.imageUrl === 'string' && sticker.imageUrl.length > 0
    const { dragRef, onRootPointerDown } = useStickerDrag(id, sticker, setPosition, bringToFront)
    const {
        editing,
        onDoubleClick,
        onInput,
        onContentBlur,
        setupContentEditable,
        setupAutoFontSize
    } = useStickerContent(sticker, isImage, setText)
    const {
        menuVisible,
        setMenuVisible,
        menuPos,
        onContextMenu
    } = useStickerMenu(id)

    useDragEvents(dragRef, id, setPosition)

    setupContentEditable(contentRef)
    setupAutoFontSize(contentRef)

    const textColor = useMemo(() => {
        if (sticker && typeof sticker.color === 'string') {
            try {
                return getContrastColorForBackground(sticker.color)
            } catch (e) {
                return '#0a0a0a'
            }
        }
        return '#0a0a0a'
    }, [sticker?.color])

    const showImageControls = isImage && hovered && !menuVisible

    const resizableClassName = [
        'resizable-sticker-wrapper',
        isImage ? 'resizable-sticker-wrapper--image' : '',
        showImageControls ? 'resizable-sticker-wrapper--image-active' : ''
    ].filter(Boolean).join(' ')

    const onDragStart = (e) => {
        e.preventDefault()
    }

    const onResizeStop = (e, dir, ref, delta) => {
        const w = ref.offsetWidth
        const h = ref.offsetHeight
        setSize(id, w, h)
    }

    const handleDelete = async () => {
        setMenuVisible(false)
        try {
            await notesApi.deleteSticker(id)
            removeSticker(id)
        } catch (e) {
            console.error('Не удалось удалить стикер:', e)
            alert('Ошибка при удалении стикера')
        }
    }

    const background = isImage ? 'transparent' : (sticker.color || '#fff')

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
                    style={{ background, color: textColor, caretColor: textColor }}
                    onContextMenu={onContextMenu}
                    onPointerDown={(e) => onRootPointerDown(e, contentRef, isImage)}
                    onDoubleClick={onDoubleClick}
                >
                    <div className={`sticker-content ${isImage ? 'sticker-content--image' : ''}`}>
                        {!isImage && (
                            <div
                                ref={contentRef}
                                contentEditable={editing}
                                suppressContentEditableWarning
                                spellCheck={false}
                                onInput={onInput}
                                onBlur={() => onContentBlur(notesApi)}
                                className="sticker-text"
                                style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    color: textColor,
                                    caretColor: textColor,
                                    pointerEvents: editing ? 'auto' : 'none'
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
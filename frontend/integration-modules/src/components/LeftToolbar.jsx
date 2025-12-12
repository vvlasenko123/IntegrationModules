import React, {useState} from 'react'
import { ColorPalette } from './ColorPalette.jsx'
import { SHAPES } from '../features/shape/constants.jsx'
import '../styles/stickerPalette.css'
import noteAdd from '../assets/note_add.svg'
import noteAddActive from '../assets/note_add_active.svg'
import emojiAdd from '../assets/emoji_add.svg'
import emojiAddActive from '../assets/emoji_add_active.svg'
import shapeAdd from '../assets/shape_add.svg'
import shapeAddActive from '../assets/shape_add_active.svg'
import { stickersApi } from '../shared/api/stickerApi.js'
import { DND_SHAPE, DND_EMOJI, DND_CODE } from '../features/board/constants.js'
import { SHAPE_ICONS } from "./shapeIcons.jsx";
import markdownAdd from '../assets/markdown_add.svg'
import markdownAddActive from '../assets/markdown_add_active.svg'

export const LeftToolbar = ({ onPick }) => {
    const [open, setOpen] = React.useState(false)
    const [emojiOpen, setEmojiOpen] = React.useState(false)
    const [shapeOpen, setShapeOpen] = React.useState(false)
    const [emojiItems, setEmojiItems] = React.useState([])
    const wrapperRef = React.useRef(null)
    const [isMarkdownDragging, setIsMarkdownDragging] = React.useState(false);

    const toggle = (e) => {
        e.stopPropagation()
        setOpen(v => !v)
        setEmojiOpen(false)
        setShapeOpen(false)
    }

    const toggleEmoji = (e) => {
        e.stopPropagation()
        setEmojiOpen(v => !v)
        setOpen(false)
        setShapeOpen(false)
    }

    const toggleShape = (e) => {
        e.stopPropagation()
        setShapeOpen(v => !v)
        setOpen(false)
        setEmojiOpen(false)
    }

    React.useEffect(() => {
        if (!emojiOpen) return
        let cancelled = false
        ;(async () => {
            try {
                const items = await stickersApi.getAll()
                if (!cancelled) setEmojiItems(Array.isArray(items) ? items : [])
            } catch (e) {
                console.warn('Не удалось загрузить эмодзи:', e)
                if (!cancelled) setEmojiItems([])
            }
        })()
        return () => { cancelled = true }
    }, [emojiOpen])

    React.useEffect(() => {
        if (!open && !emojiOpen && !shapeOpen) return
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false)
                setEmojiOpen(false)
                setShapeOpen(false)
            }
        }
        window.addEventListener('pointerdown', handler)
        return () => window.removeEventListener('pointerdown', handler)
    }, [open, emojiOpen, shapeOpen])

    const onEmojiDragStart = (item) => (e) => {
        e.stopPropagation()
        const payload = { url: item.url, storagePath: item.storagePath, id: item.id }
        e.dataTransfer.setData(DND_EMOJI, JSON.stringify(payload))
        e.dataTransfer.effectAllowed = 'copy'
    }

    const onShapeDragStart = (shape) => (e) => {
        e.stopPropagation()
        e.dataTransfer.setData(DND_SHAPE, JSON.stringify({ shapeId: shape.id }))
        e.dataTransfer.effectAllowed = 'copy'
    }

    const onCodeDragStart = (e) => {
        e.stopPropagation();
        setIsMarkdownDragging(true);
        e.dataTransfer.setData(DND_CODE, JSON.stringify({ type: 'code' }));
        e.dataTransfer.effectAllowed = 'copy';
    };
    const onCodeDragEnd = (e) => {
        e.preventDefault();
        setIsMarkdownDragging(false);
    };

    return (
        <div className="left-toolbar-container" ref={wrapperRef} onClick={e => e.stopPropagation()}>
            <div className={`toolbar-card ${open || emojiOpen || shapeOpen ? 'toolbar-card--open' : ''}`}>
                <button onClick={toggle} className={`toolbar-btn toolbar-btn--icon toolbar-btn--note ${open ? 'toolbar-btn--active' : ''}`}>
                    <div className={`toolbar-note-plate ${open ? 'toolbar-note-plate--active' : ''}`}>
                        <img src={open ? noteAddActive : noteAdd} alt="Заметки" draggable={false} />
                    </div>
                </button>

                <button onClick={toggleEmoji} className={`toolbar-btn toolbar-btn--icon toolbar-btn--emoji ${emojiOpen ? 'toolbar-btn--active' : ''}`}>
                    <div className={`toolbar-emoji-plate ${emojiOpen ? 'toolbar-emoji-plate--active' : ''}`}>
                        <img src={emojiOpen ? emojiAddActive : emojiAdd} alt="Эмодзи" draggable={false} />
                    </div>
                </button>

                <button onClick={toggleShape} className={`toolbar-btn toolbar-btn--icon toolbar-btn--shape ${shapeOpen ? 'toolbar-btn--active' : ''}`}>
                    <div className={`toolbar-shape-plate ${shapeOpen ? 'toolbar-shape-plate--active' : ''}`}>
                        <img src={shapeOpen ? shapeAddActive : shapeAdd} alt="Фигуры" draggable={false} />
                    </div>
                </button>

                <button
                    className={`toolbar-btn toolbar-btn--icon toolbar-btn--markdown ${isMarkdownDragging ? 'toolbar-btn--active' : ''}`.trim()}
                    draggable
                    onDragStart={onCodeDragStart}
                    onDragEnd={onCodeDragEnd}
                    title="Markdown Code Block"
                >
                    <div className={`toolbar-markdown-plate ${isMarkdownDragging ? 'toolbar-markdown-plate--active' : ''}`}>
                        <img
                            src={isMarkdownDragging ? markdownAddActive : markdownAdd}
                            alt="Code"
                            draggable={false}
                        />
                    </div>
                </button>
            </div>

            {open && (
                <div className="palette-wrapper" onClick={e => e.stopPropagation()}>
                    <ColorPalette onPick={(color) => { onPick?.(color); setOpen(false) }} />
                </div>
            )}

            {emojiOpen && (
                <div className="palette-wrapper" onClick={e => e.stopPropagation()}>
                    <div className="emoji-panel" style={{ width: '300px', height: '500px' }}>
                        <div className="emoji-grid">
                            {emojiItems.map((x) => (
                                <button
                                key={`${x.id}-${x.storagePath}`}
                             className="emoji-item"
                             draggable
                             onDragStart={onEmojiDragStart(x)}
                        >
                            <img src={x.url} alt="" className="emoji-img" draggable={false} />
                        </button>
                        ))}
                    </div>
                </div>
                </div>
                )}

            {shapeOpen && (
                <div className="palette-wrapper" onClick={e => e.stopPropagation()}>
                    <div className="shape-panel">
                        <div className="shape-grid">

                            {SHAPES.map(shape => (
                                <button
                                    key={shape.id}
                                    className="shape-item"
                                    draggable
                                    onDragStart={onShapeDragStart(shape)}
                                    title={shape.name}
                                >
                                    {SHAPE_ICONS[shape.id]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
import React from 'react'
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
import { DND_SHAPE, DND_NOTE, DND_EMOJI } from '../features/board/constants.js'

export const LeftToolbar = ({ onPick }) => {
    const [open, setOpen] = React.useState(false)
    const [emojiOpen, setEmojiOpen] = React.useState(false)
    const [shapeOpen, setShapeOpen] = React.useState(false)
    const [emojiItems, setEmojiItems] = React.useState([])
    const wrapperRef = React.useRef(null)

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
                                    {/* SVG preview */}
                                    {shape.id === "square" && (
                                        <svg width="40" height="40">
                                            <rect x="4" y="4" width="32" height="32" stroke="black" fill="none" strokeWidth="2"/>
                                        </svg>
                                    )}

                                    {shape.id === "circle" && (
                                        <svg width="40" height="40">
                                            <circle cx="20" cy="20" r="14" stroke="black" fill="none" strokeWidth="2"/>
                                        </svg>
                                    )}

                                    {shape.id === "triangle" && (
                                        <svg width="40" height="40">
                                            <polygon points="20,6 34,34 6,34" stroke="black" fill="none" strokeWidth="2"/>
                                        </svg>
                                    )}

                                    {shape.id === "star" && (
                                        <svg width="40" height="40">
                                            <polygon
                                                points="20,4 25,16 38,16 27,24 32,36 20,28 8,36 13,24 2,16 15,16"
                                                stroke="black"
                                                fill="none"
                                                strokeWidth="2"
                                            />
                                        </svg>
                                    )}

                                    {shape.id === "stick" && (
                                        <svg width="40" height="40">
                                            <rect x="16" y="4" width="8" height="32" stroke="black" fill="none" strokeWidth="2"/>
                                        </svg>
                                    )}

                                    {shape.id === "arrow" && (
                                        <svg width="40" height="40">
                                            <line x1="4" y1="20" x2="30" y2="20" stroke="black" strokeWidth="2"/>
                                            <polygon points="30,14 38,20 30,26" fill="black"/>
                                        </svg>
                                    )}

                                    {shape.id === "dblarrow" && (
                                        <svg width="40" height="40">
                                            <polygon points="4,20 12,14 12,26" fill="black" />
                                            <line x1="12" y1="20" x2="28" y2="20" stroke="black" strokeWidth="2"/>
                                            <polygon points="28,14 36,20 28,26" fill="black"/>
                                        </svg>
                                    )}

                                    {shape.id === "parallelogram" && (
                                        <svg width="40" height="40">
                                            <polygon points="10,6 34,6 30,34 6,34"
                                                     stroke="black" fill="none" strokeWidth="2"/>
                                        </svg>
                                    )}

                                </button>
                            ))}

                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
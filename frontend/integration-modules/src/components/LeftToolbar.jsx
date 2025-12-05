import React from 'react'
import { ColorPalette } from './ColorPalette.jsx'
import '../styles/stickerPalette.css'
import noteAdd from '../assets/note_add.svg'
import noteAddActive from '../assets/note_add_active.svg'
import emojiAdd from '../assets/emoji_add.svg'
import emojiAddActive from '../assets/emoji_add_active.svg'
import { stickersApi } from '../shared/api/stickerApi.js'


export const LeftToolbar = ({ onPick }) => {
    const [open, setOpen] = React.useState(false)
    const [emojiOpen, setEmojiOpen] = React.useState(false)
    const [emojiItems, setEmojiItems] = React.useState([])
    const wrapperRef = React.useRef(null)

    const toggle = (e) => {
        e.stopPropagation()
        setOpen((v) => !v)
        setEmojiOpen(false)
    }

    const toggleEmoji = (e) => {
        e.stopPropagation()
        setEmojiOpen((v) => !v)
        setOpen(false)
    }

    React.useEffect(() => {
        if (!emojiOpen) {
            return
        }

        let cancelled = false

        ;(async () => {
            try {
                const items = await stickersApi.getAll()
                if (cancelled) {
                    return
                }
                setEmojiItems(Array.isArray(items) ? items : [])
            } catch (e) {
                console.warn('Не удалось загрузить эмодзи:', e)
                if (!cancelled) {
                    setEmojiItems([])
                }
            }
        })()

        return () => {
            cancelled = true
        }
    }, [emojiOpen])

    React.useEffect(() => {
        if (!open && !emojiOpen) {
            return
        }

        const onPointerDown = (ev) => {
            const el = wrapperRef.current
            if (!el) {
                return
            }
            if (el.contains(ev.target)) {
                return
            }
            setOpen(false)
            setEmojiOpen(false)
        }

        window.addEventListener('pointerdown', onPointerDown)
        return () => window.removeEventListener('pointerdown', onPointerDown)
    }, [open, emojiOpen])

    const onEmojiDragStart = (item) => (e) => {
        e.stopPropagation()

        const payload = {
            url: item.url,
            storagePath: item.storagePath,
            id: item.id
        }

        try {
            e.dataTransfer.setData('application/x-integration-emoji', JSON.stringify(payload))
            e.dataTransfer.effectAllowed = 'copy'
        } catch (err) {
            console.warn('Не удалось начать перенос эмодзи:', err)
        }
    }

    return (
        <div className="left-toolbar-container" ref={wrapperRef} onClick={(e) => e.stopPropagation()}>
            <div className={`toolbar-card ${(open || emojiOpen) ? 'toolbar-card--open' : ''}`}>
                <button
                    onClick={toggle}
                    title="Стикеры"
                    aria-pressed={open}
                    className={`toolbar-btn toolbar-btn--icon toolbar-btn--note ${open ? 'toolbar-btn--active' : ''}`}
                >
                    <div className={`toolbar-note-plate ${open ? 'toolbar-note-plate--active' : ''}`}>
                        <img
                            src={open ? noteAddActive : noteAdd}
                            alt={open ? 'Стикеры (открыто)' : 'Стикеры'}
                            className={`toolbar-note-icon ${open ? 'toolbar-note-icon--active' : ''}`}
                            draggable={false}
                        />
                    </div>
                </button>

                <button
                    className={`toolbar-btn toolbar-btn--icon toolbar-btn--emoji ${emojiOpen ? 'toolbar-btn--active' : ''}`}
                    title="Эмодзи"
                    onClick={toggleEmoji}
                    aria-label="Эмодзи"
                    aria-pressed={emojiOpen}
                >
                    <div className={`toolbar-emoji-plate ${emojiOpen ? 'toolbar-emoji-plate--active' : ''}`} role="img" aria-hidden="true">
                        <img
                            src={emojiOpen ? emojiAddActive : emojiAdd}
                            alt=""
                            className="toolbar-emoji-img"
                            draggable={false}
                        />
                    </div>
                </button>
            </div>

            {open && (
                <div className="palette-wrapper" onClick={(e) => e.stopPropagation()}>
                    <ColorPalette onPick={(color) => { if (onPick) { onPick(color) } setOpen(false) }} />
                </div>
            )}

            {emojiOpen && (
                <div className="palette-wrapper" onClick={(e) => e.stopPropagation()}>
                    <div
                        className="emoji-panel"
                        role="dialog"
                        aria-label="Панель эмодзи"
                        style={{ width: '300.06px', height: '500.25px' }}
                    >
                        <div className="emoji-grid">
                            {emojiItems.map((x) => (
                                <button
                                    key={`${x.id}-${x.storagePath}`}
                                    type="button"
                                    className="emoji-item"
                                    draggable
                                    onDragStart={onEmojiDragStart(x)}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    aria-label="Эмодзи"
                                    title={x.storagePath}
                                >
                                    <img src={x.url} alt="" className="emoji-img" draggable={false} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
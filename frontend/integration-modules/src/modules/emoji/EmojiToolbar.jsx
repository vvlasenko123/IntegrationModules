// modules/emoji/EmojiToolbar.jsx
import React from 'react'
import '../../styles/stickerPalette.css'
import { EMOJI_CATALOG } from '../../features/emoji-sticker/stickers.js'
import { stickersApi } from '../../shared/api/stickerApi.js'
import emojiAdd from '../../assets/emoji_add.svg'
import emojiAddActive from '../../assets/emoji_add_active.svg'

export const EmojiToolbar = ({ onCreateClick }) => {
    const [open, setOpen] = React.useState(false)
    const [items, setItems] = React.useState([])
    const wrapperRef = React.useRef(null)

    React.useEffect(() => {
        if (!open) return
        let cancelled = false
        ;(async () => {
            try {
                const stickers = await stickersApi.getAll()
                if (cancelled) return
                setItems(stickers.map(s => {
                    const local = EMOJI_CATALOG.find(e => e.name === s.name)
                    return local ? { ...s, url: local.url } : { ...s, url: '' }
                }).filter(Boolean))
            } catch (err) {
                console.warn('EmojiToolbar: failed to fetch stickers', err)
            }
        })()
        return () => { cancelled = true }
    }, [open])

    React.useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        window.addEventListener('pointerdown', handler)
        return () => window.removeEventListener('pointerdown', handler)
    }, [])


    return (
        <div className="left-toolbar-container" ref={wrapperRef} onClick={e => e.stopPropagation()}>
            <div className={`toolbar-card ${open ? 'toolbar-card--open' : ''}`}>
                <button onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }} className={`toolbar-btn toolbar-btn--icon toolbar-btn--emoji ${open ? 'toolbar-btn--active' : ''}`}>
                    <div className={`toolbar-emoji-plate ${open ? 'toolbar-emoji-plate--active' : ''}`}>
                        <img src={open ? emojiAddActive : emojiAdd} alt="Эмодзи" draggable={false} />
                    </div>
                </button>
            </div>

            {open && (
                <div className="palette-wrapper" onClick={e => e.stopPropagation()}>
                    <div className="emoji-panel" style={{ width: 300, height: 500 }}>
                        <div className="emoji-panel-header"><span className="emoji-header-title">Стикеры</span></div>
                        <div className="emoji-grid">
                            {items.map(item => (
                                <button
                                    key={item.id}
                                    className="emoji-item"
                                    title={item.name}
                                    onClick={() => onCreateClick?.(item.id)}
                                >
                                    <img src={item.url} draggable={false} alt={item.name} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

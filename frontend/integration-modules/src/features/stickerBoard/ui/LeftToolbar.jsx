import React from 'react'
import { ColorPalette } from './ColorPalette'
import './stickerPalette.css'
import noteAdd from './assets/note_add.svg'
import noteAddActive from './assets/note_add_active.svg'
import emojiStub from './assets/emoji_stub.svg'

/**
 * LeftToolbar: верхняя кнопка — note plate; нижняя — SVG-заглушка (plate + image).
 * Теперь нижняя кнопка полностью является изображением в плитке, как у стикера.
 */
export const LeftToolbar = ({ onPick }) => {
    const [open, setOpen] = React.useState(false)
    const wrapperRef = React.useRef(null)

    const toggle = (e) => {
        e.stopPropagation()
        setOpen(v => !v)
    }

    React.useEffect(() => {
        if (!open) return
        const onPointerDown = (ev) => {
            const el = wrapperRef.current
            if (!el) return
            if (el.contains(ev.target)) return
            setOpen(false)
        }
        window.addEventListener('pointerdown', onPointerDown)
        return () => window.removeEventListener('pointerdown', onPointerDown)
    }, [open])

    return (
        <div className="left-toolbar-container" ref={wrapperRef} onClick={(e) => e.stopPropagation()}>
            <div className={`toolbar-card ${open ? 'toolbar-card--open' : ''}`}>
                {/* верхняя кнопка — белая "пластина" с большой иконкой */}
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

                {/* нижняя кнопка — теперь плитка с SVG-картинкой (кнопка выглядит как у стикера) */}
                <button
                    className="toolbar-btn toolbar-btn--icon toolbar-btn--emoji"
                    title="Инструмент"
                    onClick={(e) => { e.stopPropagation(); /* обработчик инструмента */ }}
                    aria-label="Инструмент"
                >
                    <div className="toolbar-emoji-plate" role="img" aria-hidden="true">
                        <img src={emojiStub} alt="" className="toolbar-emoji-img" draggable={false} />
                    </div>
                </button>
            </div>

            {open && (
                <div className="palette-wrapper" onClick={(e) => e.stopPropagation()}>
                    <ColorPalette onPick={(color) => { onPick && onPick(color); setOpen(false) }} />
                </div>
            )}
        </div>
    )
}
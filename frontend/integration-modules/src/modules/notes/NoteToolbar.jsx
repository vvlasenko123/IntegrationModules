import React from 'react'
import '../../styles/stickerPalette.css'
import noteAdd from '../../assets/note_add.svg'
import noteAddActive from '../../assets/note_add_active.svg'
import { ColorPalette } from '../../components/ColorPalette.jsx'

export const NoteToolbar = ({ onPick }) => {
    const [open, setOpen] = React.useState(false)

    const toggle = (e) => {
        e.stopPropagation()
        setOpen(v => !v)
    }

    return (
        <div className="left-toolbar-container" onClick={e => e.stopPropagation()}>
            <div className={`toolbar-card ${open ? 'toolbar-card--open' : ''}`}>
                <button onClick={toggle} className={`toolbar-btn toolbar-btn--icon toolbar-btn--note ${open ? 'toolbar-btn--active' : ''}`}>
                    <div className={`toolbar-note-plate ${open ? 'toolbar-note-plate--active' : ''}`}>
                        <img src={open ? noteAddActive : noteAdd} alt="Заметки" draggable={false} />
                    </div>
                </button>
            </div>

            {open && (
                <div className="palette-wrapper" onClick={e => e.stopPropagation()}>
                    <ColorPalette onPick={(color) => { onPick?.(color); setOpen(false) }} />
                </div>
            )}
        </div>
    )
}

// NoteToolbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ColorPalette } from './ColorPalette.jsx';
import noteAdd from '../assets/note_add.svg';
import noteAddActive from '../assets/note_add_active.svg';
import '../styles/stickerPalette.css';

export const NoteToolbar = ({ onPick }) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const toggle = (e) => {
        e.stopPropagation();
        setOpen((v) => !v);
    };

    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        window.addEventListener('pointerdown', handler);
        return () => window.removeEventListener('pointerdown', handler);
    }, [open]);

    return (
        <div className="left-toolbar-container dragHandle__custom" ref={wrapperRef} onClick={(e) => e.stopPropagation()}>
            <div className={`toolbar-card ${open ? 'toolbar-card--open' : ''}`}>
                <button onClick={toggle} className={`toolbar-btn toolbar-btn--icon toolbar-btn--note ${open ? 'toolbar-btn--active' : ''}`}>
                    <div className={`toolbar-note-plate ${open ? 'toolbar-note-plate--active' : ''}`}>
                        <img src={open ? noteAddActive : noteAdd} alt="Заметки" draggable={false} />
                    </div>
                </button>
            </div>
            {open && (
                <div className="palette-wrapper" onClick={(e) => e.stopPropagation()}>
                    <ColorPalette onPick={(color) => { onPick?.(color); setOpen(false); }} />
                </div>
            )}
        </div>
    );
};
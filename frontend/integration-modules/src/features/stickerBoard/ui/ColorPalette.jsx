import React from 'react'
import './stickerPalette.css'

const COLORS = [
    '#FFF9C4', '#FFD7A6', '#FFCCF2', '#FFB3E6',
    '#C8F3FF', '#9FD0FF', '#D9E6FF', '#D6C7FF',
    '#A6FFD6', '#8AF2A3', '#FFFFFF', '#222222'
]

/**
 * Увеличенная двухколоночная палитра.
 * onPick(color) — вызывается при выборе цвета.
 */
export const ColorPalette = ({ onPick }) => {
    return (
        <div className="palette-panel palette-panel--large">
            <div className="palette-grid">
                {COLORS.map(c => (
                    <button
                        key={c}
                        onClick={() => onPick ? onPick(c) : null}
                        aria-label={`color-${c}`}
                        title={c}
                        className="color-swatch color-swatch--large"
                        style={{ background: c }}
                    />
                ))}
            </div>
        </div>
    )
}
import React from 'react'

const DND_NOTE = 'application/x-integration-note'

const COLORS = [
    '#FFF9C4',
    '#C8E6C9',
    '#BBDEFB',
    '#FFCCBC',
    '#E1BEE7',
    '#CFD8DC',
    '#222222',
    '#FFFFFF'
]

export const ColorPalette = ({ onPick }) => {
    const onSwatchClick = (color) => () => {
        if (onPick) {
            onPick(color)
        }
    }

    const onSwatchDragStart = (color) => (e) => {
        e.stopPropagation()

        try {
            e.dataTransfer.setData(DND_NOTE, JSON.stringify({ color }))
            e.dataTransfer.effectAllowed = 'copy'
        } catch (err) {
            console.warn('Не удалось начать перенос заметки:', err)
        }
    }

    return (
        <div className="palette-panel--large" role="dialog" aria-label="Палитра">
            <div className="palette-grid">
                {COLORS.map((c) => (
                    <button
                        key={c}
                        type="button"
                        className="color-swatch color-swatch--large"
                        title={c}
                        style={{ background: c }}
                        onClick={onSwatchClick(c)}
                        draggable
                        onDragStart={onSwatchDragStart(c)}
                    />
                ))}
            </div>
        </div>
    )
}
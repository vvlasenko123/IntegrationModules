// modules/shapes/ShapeToolbar.jsx
import React from 'react'
import '../../styles/stickerPalette.css'
import shapeAdd from '../../assets/shape_add.svg'
import shapeAddActive from '../../assets/shape_add_active.svg'
import { SHAPES } from '../../features/shape/constants.jsx'
import { SHAPE_ICONS } from '../../components/shapeIcons.jsx'

export const ShapeToolbar = ({ onShapeClick }) => {
    const [open, setOpen] = React.useState(false)
    const wrapperRef = React.useRef(null)

    React.useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        window.addEventListener('pointerdown', handler)
        return () => window.removeEventListener('pointerdown', handler)
    }, [])

    const onSelectShape = (shape) => (e) => {
        e.stopPropagation()
        onShapeClick?.(shape)
        setOpen(false)
    }

    return (
        <div className="left-toolbar-container" ref={wrapperRef} onClick={e => e.stopPropagation()}>
            <div className={`toolbar-card ${open ? 'toolbar-card--open' : ''}`}>
                <button
                    onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
                    className={`toolbar-btn toolbar-btn--icon toolbar-btn--shape ${open ? 'toolbar-btn--active' : ''}`}
                >
                    <div className={`toolbar-shape-plate ${open ? 'toolbar-shape-plate--active' : ''}`}>
                        <img src={open ? shapeAddActive : shapeAdd} alt="Фигуры" draggable={false} />
                    </div>
                </button>
            </div>

            {open && (
                <div className="palette-wrapper" onClick={e => e.stopPropagation()}>
                    <div className="shape-panel">
                        <div className="shape-grid">
                            {SHAPES.map(shape => (
                                <button
                                    key={shape.id}
                                    className="shape-item"
                                    onClick={onSelectShape(shape)}
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

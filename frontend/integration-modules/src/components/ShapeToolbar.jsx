// ShapeToolbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { SHAPES } from '../features/shape/constants.jsx';
import { SHAPE_ICONS } from "./shapeIcons.jsx";
import { DND_SHAPE } from '../features/board/constants.js';
import shapeAdd from '../assets/shape_add.svg';
import shapeAddActive from '../assets/shape_add_active.svg';
import '../styles/stickerPalette.css';

export const ShapeToolbar = () => {
    const [shapeOpen, setShapeOpen] = useState(false);
    const wrapperRef = useRef(null);

    const toggleShape = (e) => {
        e.stopPropagation();
        setShapeOpen((v) => !v);
    };

    useEffect(() => {
        if (!shapeOpen) return;
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShapeOpen(false);
            }
        };
        window.addEventListener('pointerdown', handler);
        return () => window.removeEventListener('pointerdown', handler);
    }, [shapeOpen]);

    const onShapeDragStart = (shape) => (e) => {
        e.stopPropagation();
        e.dataTransfer.setData(DND_SHAPE, JSON.stringify({ shapeId: shape.id }));
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div className="left-toolbar-container dragHandle__custom" ref={wrapperRef} onClick={(e) => e.stopPropagation()}>
            <div className={`toolbar-card ${shapeOpen ? 'toolbar-card--open' : ''}`}>
                <button onClick={toggleShape} className={`toolbar-btn toolbar-btn--icon toolbar-btn--shape ${shapeOpen ? 'toolbar-btn--active' : ''}`}>
                    <div className={`toolbar-shape-plate ${shapeOpen ? 'toolbar-shape-plate--active' : ''}`}>
                        <img src={shapeOpen ? shapeAddActive : shapeAdd} alt="Фигуры" draggable={false} />
                    </div>
                </button>
            </div>
            {shapeOpen && (
                <div className="palette-wrapper" onClick={(e) => e.stopPropagation()}>
                    <div className="shape-panel">
                        <div className="shape-grid">
                            {SHAPES.map((shape) => (
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
    );
};
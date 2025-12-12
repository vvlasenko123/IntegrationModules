import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import { useStickersStore } from "../../../entities/stickers/model/useStickersStore";
import { shapes } from "./shapes.jsx"; // импорт фигур

export const ShapeSticker = ({ id }) => {
    const sticker = useStickersStore(s => s.stickers.find(st => st.id === id));
    const update = useStickersStore(s => s.updateSticker);
    const select = useStickersStore(s => s.selectSticker);
    const bringToFront = useStickersStore(s => s.bringToFront);
    const isSelected = useStickersStore(s => s.selectedId === id);
    const rndRef = useRef();

    if (!sticker) return null;

    const { x, y, width, height, rotation, fill, stroke, shapeId, zIndex } = sticker;

    const notifyTouched = () => {
        window.dispatchEvent(new CustomEvent("sticker-touched", { detail: { id, type: "shape" } }));
    };

    const onDragStop = (e, d) => { update(id, { x: d.x, y: d.y }); notifyTouched(); };
    const onResizeStop = (e, direction, ref, delta, position) => {
        update(id, {x: position.x, y: position.y, width: ref.offsetWidth, height: ref.offsetHeight});
        notifyTouched();
    };
    const handleClick = (e) => {
        e.stopPropagation();
        bringToFront(id);
        select(id);
        notifyTouched();
    };

    const renderShape = () => {
        const renderFn = shapes[shapeId];
        return renderFn ? renderFn({ fill, stroke }) : shapes.square({ fill, stroke });
    };

    const renderRig = () => {
        const points = [
            { left: 0, top: 0 }, { left: '50%', top: 0 }, { left: '100%', top: 0 },
            { left: 0, top: '50%' }, { left: '100%', top: '50%' },
            { left: 0, top: '100%' }, { left: '50%', top: '100%' }, { left: '100%', top: '100%' },
        ];
        return points.map((p, idx) => (
            <div key={idx} style={{
                position: 'absolute', width: 8, height: 8, background: '#1976d2',
                borderRadius: 2, left: p.left, top: p.top, transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }}/>
        ));
    };

    return (
        <Rnd
            ref={rndRef}
            size={{ width, height }}
            position={{ x, y }}
            onDragStop={onDragStop}
            onResizeStop={onResizeStop}
            bounds="parent"
            style={{ zIndex, transform: `rotate(${rotation || 0}deg)`, touchAction: 'none', borderRadius: shapeId === 'circle' ? '50%' : 0, boxSizing: 'border-box', position: 'absolute' }}
            onClick={handleClick}
            onDragStart={() => { bringToFront(id); select(id); }}
        >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {renderShape()}
                </svg>

                {isSelected && (
                    <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'1px dashed #1976d2', pointerEvents:'none' }}>
                        {renderRig()}
                    </div>
                )}
            </div>
        </Rnd>
    );
};

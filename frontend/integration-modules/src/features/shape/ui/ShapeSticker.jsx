import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import { useStickersStore } from "../../../entities/stickers/model/useStickersStore";

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
        update(id, { x: position.x, y: position.y, width: ref.offsetWidth, height: ref.offsetHeight });
        notifyTouched();
    };

    const handleClick = (e) => {
        e.stopPropagation();
        bringToFront(id);
        select(id);
        notifyTouched();
    };

    const renderShape = () => {
        switch (shapeId) {
            case "line":
                return <line x1="0" y1="50%" x2="100%" y2="50%" stroke={stroke || "#000"} strokeWidth={2} />;
            case "arrow":
                return <line x1="0" y1="50%" x2="100%" y2="50%" stroke={stroke || "#000"} strokeWidth={2} markerEnd="url(#arrowhead-end)" />;
            case "dblarrow":
                return <line x1="0" y1="50%" x2="100%" y2="50%" stroke={stroke || "#000"} strokeWidth={2} markerEnd="url(#arrowhead-end)"  markerStart="url(#arrowhead-start)" />;
            case "square":
                return <rect width="100%" height="100%" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "circle":
                return <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "triangle":
                return <polygon points="50,0 100,100 0,100" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "star":
                return <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "parallelogram":
                return <polygon points="20,0 100,0 80,100 0,100" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "stick":
                return <rect width="100%" height="100%" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "roundedRect":
                return <rect width="100%" height="100%" rx="20" ry="20" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "capsule":
                return <rect width="100%" height="100%" rx="50" ry="50" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "pentagon":
                return <polygon points="50,0 100,38 82,100 18,100 0,38" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "cloud":
                return <path d="M20,60 Q0,30 40,20 Q60,0 80,20 Q120,0 140,40 Q160,40 140,60 Z" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "speech":
                return <path d="M10,0 Q170,0 170,80 Q170,100 150,100 L130,120 L130,100 Q10,100 10,80 Z" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "chevron":
                return <polygon points="0,0 100,0 60,50 100,100 0,100 40,50" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "table3x3":
            case "table3x3LeftMerge":
                return <>
                    <rect width="100%" height="100%" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2}/>
                    <line x1="0" y1="33%" x2="100%" y2="33%" stroke={stroke||"#000"} strokeWidth={1}/>
                    <line x1="0" y1="66%" x2="100%" y2="66%" stroke={stroke||"#000"} strokeWidth={1}/>
                    <line x1="33%" y1="0" x2="33%" y2="100%" stroke={stroke||"#000"} strokeWidth={1}/>
                    <line x1="66%" y1="0" x2="66%" y2="100%" stroke={stroke||"#000"} strokeWidth={1}/>
                </>;
            case "pyramid":
                return <polygon points="50,0 100,100 0,100" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
            case "circleArrow":
                return <>
                    <circle cx="50%" cy="50%" r="50%" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2}/>
                    <line x1="50%" y1="0%" x2="50%" y2="50%" stroke={stroke||"#000"} strokeWidth={2} markerEnd="url(#arrowhead)"/>
                </>;
            default:
                return <rect width="100%" height="100%" fill={fill||"transparent"} stroke={stroke||"#000"} strokeWidth={2} />;
        }
    };


    const renderRig = () => {
        const points = [
            { left: 0, top: 0 },
            { left: '50%', top: 0 },
            { left: '100%', top: 0 },
            { left: 0, top: '50%' },
            { left: '100%', top: '50%' },
            { left: 0, top: '100%' },
            { left: '50%', top: '100%' },
            { left: '100%', top: '100%' },
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
            style={{
                zIndex,
                transform: `rotate(${rotation || 0}deg)`,
                touchAction: 'none',
                borderRadius: shapeId === 'circle' ? '50%' : 0,
                boxSizing: 'border-box',
                position: 'absolute'
            }}
            onClick={handleClick}
            onDragStart={() => {
                bringToFront(id);
                select(id);
            }}
        >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <svg width="100%" height="100%">
                    <defs>
                        <marker id="arrowhead-end" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill={stroke || "#000"} />
                        </marker>

                        <marker id="arrowhead-start" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="10 0, 0 3.5, 10 7" fill={stroke || "#000"} />
                        </marker>
                    </defs>
                    {renderShape()}
                </svg>

                {isSelected && (
                    <div style={{
                        position:'absolute', top:0, left:0, width:'100%', height:'100%',
                        border:'1px dashed #1976d2', pointerEvents:'none'
                    }}>
                        {renderRig()}
                    </div>
                )}
            </div>
        </Rnd>
    );
};

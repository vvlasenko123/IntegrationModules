import React, { useRef, useEffect } from "react";
import { Rect, Line, Star, Arrow, Transformer, Ellipse, Path, Circle } from "react-konva";
import { useStickersStore } from "../../../entities/stickers/model/useStickersStore";

export const ShapeSticker = ({ id }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    const sticker = useStickersStore(s => s.stickers.find(st => st.id === id));
    const update = useStickersStore(s => s.updateSticker);
    const select = useStickersStore(s => s.selectSticker);
    const bringToFront = useStickersStore(s => s.bringToFront);
    const isSelected = useStickersStore(s => s.selectedId === id);

    const polyPoints = (w, h, sides) => {
        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(w, h) / 2;
        const points = [];
        for (let i = 0; i < sides; i++) {
            const theta = (Math.PI * 2 * i) / sides - Math.PI / 2;
            const x = Math.round(cx + radius * Math.cos(theta));
            const y = Math.round(cy + radius * Math.sin(theta));
            points.push(x, y);
        }
        return points;
    };

    if (!sticker) {
        return null;
    }

    const { x, y, width, height, rotation, fill, stroke, shapeId } = sticker;

    const notifyTouched = () => {
        window.dispatchEvent(new CustomEvent('sticker-touched', { 
            detail:
                {
                    id, 
                    type: 'shape' 
                } 
        }));
    }

    const common = {
        ref: shapeRef,
        x,
        y,
        width,
        height,
        rotation,
        fill: fill ?? "transparent",
        stroke: stroke || "#000",
        strokeWidth: 2,
        draggable: true,
        onClick: (e) => {
            e.cancelBubble = true;
            bringToFront(id);
            select(id);
            notifyTouched();
        },
        onPointerDown: (e) => {
            e.cancelBubble = true;
            bringToFront(id);
            select(id);
            notifyTouched();
        },
        onDragStart: (e) => {
            e.cancelBubble = true;
            bringToFront(id);
            select(id);
            notifyTouched();
            window.dispatchEvent(new CustomEvent('shape-drag-start', { detail: { id } }));
        },
        onDragEnd: (e) => {
            update(id, { x: e.target.x(), y: e.target.y() });
            window.dispatchEvent(new CustomEvent('shape-drag-end', { detail: { id } }));
            notifyTouched();
        },
        onTransformStart: () => {
            bringToFront(id);
            select(id);
            notifyTouched();
            window.dispatchEvent(new CustomEvent('shape-transform-start', { detail: { id } }));
        },
        onTransformEnd: () => {
            const node = shapeRef.current;

            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            if (shapeId === "stick" || shapeId === "arrow" || shapeId === "dblarrow" || shapeId === "line") {
                update(id, {
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(20, width * scaleX),
                    height,
                    rotation: node.rotation(),
                });
            } else if (shapeId === "circle") {
                update(id, {
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(20, width * scaleX),
                    height: Math.max(20, height * scaleY),
                    rotation: node.rotation(),
                });
            } else {
                update(id, {
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(20, width * scaleX),
                    height: Math.max(20, height * scaleY),
                    rotation: node.rotation(),
                });
            }

            node.scaleX(1);
            node.scaleY(1);
            window.dispatchEvent(new CustomEvent('shape-transform-end', { detail: { id } }));
            notifyTouched();
        }
    };

    const shape = (() => {
        switch (shapeId) {
            case "square":
                return <Rect {...common} />;
            case "roundedRect":
                return <Rect {...common} cornerRadius={12} />;
            case "capsule": {
                const radius = Math.round((height || 0) / 2);
                return <Rect {...common} cornerRadius={radius} />;
            }
            case "circle":
                return <Ellipse
                    {...common}
                    radiusX={width / 2}
                    radiusY={height / 2}
                />;
            case "triangle":
                return <Line {...common} points={[width / 2, 0, width, height, 0, height]} closed />;
            case "roundedTriangle":
                return <Line {...common} points={[width / 2, 0, width, height, 0, height]} closed />;
            case "star":
                return <Star {...common} numPoints={5} innerRadius={width * 0.35} outerRadius={width / 2} />;
            case "pentagon":
                return <Line {...common} points={polyPoints(width, height, 5)} closed />;
            case "cloud": {
                const w = width || 180;
                const h = height || 120;
                const path = `
                    M ${w * 0.2} ${h * 0.6}
                    C ${w * 0.05} ${h * 0.6}, ${w * 0.05} ${h * 0.4}, ${w * 0.15} ${h * 0.3}
                    C ${w * 0.15} ${h * 0.15}, ${w * 0.35} ${h * 0.1}, ${w * 0.45} ${h * 0.2}
                    C ${w * 0.55} ${h * 0.05}, ${w * 0.75} ${h * 0.05}, ${w * 0.85} ${h * 0.2}
                    C ${w * 0.95} ${h * 0.25}, ${w * 0.95} ${h * 0.45}, ${w * 0.8} ${h * 0.55}
                    L ${w * 0.2} ${h * 0.6}
                    Z
                `;
                return <Path {...common} data={path} listening={true} />;
            }
            case "speech": {
                const w = width || 180;
                const h = height || 120;
                const path = `
                    M 10 ${h * 0.2}
                    Q ${w * 0.5} ${-h * 0.1}, ${w - 10} ${h * 0.2}
                    Q ${w * 1.05} ${h * 0.45}, ${w - 10} ${h * 0.7}
                    L ${w * 0.6} ${h * 0.7}
                    L ${w * 0.5} ${h * 0.9}
                    L ${w * 0.4} ${h * 0.7}
                    L 10 ${h * 0.7}
                    Q -5 ${h * 0.45}, 10 ${h * 0.2}
                    Z
                `;
                return <Path {...common} data={path} listening={true} />;
            }
            case "arrow":
                return <Arrow {...common} points={[0, height / 2, width, height / 2]} pointerLength={20} pointerWidth={20} />;
            case "dblarrow":
                return <Arrow {...common} points={[0, height / 2, width, height / 2]} pointerLength={20} pointerWidth={20} pointerAtBeginning />;
            case "parallelogram":
                return <Line {...common} points={[40, 0, width, 0, width - 40, height, 0, height]} closed />;
            case "line":
                return <Line {...common} points={[0, height / 2, width, height / 2]} stroke={stroke || "#000"} strokeWidth={2} />;
            case "chevron": {
                const pts = [0, height, width * 0.5, height * 0.2, width, height];
                return <Line {...common} points={pts} stroke={stroke || "#000"} strokeWidth={4} closed={false} />;
            }
            default:
                return <Rect {...common} />;
        }
    })();

    useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <>
            {shape}
            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled
                    enabledAnchors={
                        shapeId === "stick" || shapeId === "arrow" || shapeId === "dblarrow" || shapeId === "line"
                            ? ["middle-left", "middle-right"]
                            : undefined
                    }
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 20) {
                            return oldBox;
                        }
                        if (newBox.height < 20 && !(shapeId === "stick" || shapeId === "arrow" || shapeId === "dblarrow" || shapeId === "line")) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
};

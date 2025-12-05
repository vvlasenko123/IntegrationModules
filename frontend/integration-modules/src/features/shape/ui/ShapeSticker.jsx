import React, { useRef, useEffect } from "react";
import { Rect, Line, Star, Arrow, Transformer, Ellipse } from "react-konva";
import { useStickersStore } from "../../../entities/stickers/model/useStickersStore";

export const ShapeSticker = ({ id }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    const sticker = useStickersStore(s => s.stickers.find(st => st.id === id));
    const update = useStickersStore(s => s.updateSticker);
    const select = useStickersStore(s => s.selectSticker);
    const bringToFront = useStickersStore(s => s.bringToFront);
    const isSelected = useStickersStore(s => s.selectedId === id);

    if (!sticker) {
        return null;
    }

    const { x, y, width, height, rotation, fill, stroke, shapeId } = sticker;

    const notifyTouched = () => {
        window.dispatchEvent(new CustomEvent('sticker-touched', { detail: { id, type: 'shape' } }));
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
            case "circle":
                return <Ellipse
                    {...common}
                    radiusX={width / 2}
                    radiusY={height / 2}
                />;
            case "triangle":
                return <Line {...common} points={[width / 2, 0, width, height, 0, height]} closed />;
            case "star":
                return <Star {...common} numPoints={5} innerRadius={width * 0.35} outerRadius={width / 2} />;
            case "arrow":
                return <Arrow {...common} points={[0, height / 2, width, height / 2]} pointerLength={20} pointerWidth={20} />;
            case "dblarrow":
                return <Arrow {...common} points={[0, height / 2, width, height / 2]} pointerLength={20} pointerWidth={20} pointerAtBeginning />;
            case "parallelogram":
                return <Line {...common} points={[40, 0, width, 0, width - 40, height, 0, height]} closed />;
            case "line":
                return <Line {...common} points={[0, height / 2, width, height / 2]} stroke={stroke || "#000"} strokeWidth={2} />;
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

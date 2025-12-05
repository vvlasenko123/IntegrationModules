import React, { useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Star, Line, Arrow, Transformer } from "react-konva";
import { useStickersStore } from "../../../entities/stickers/model/useStickersStore";

export const ShapeSticker = ({ id }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    const sticker = useStickersStore(s => s.stickers.find(st => st.id === id));
    const update = useStickersStore(s => s.updateSticker);
    const select = useStickersStore(s => s.selectSticker);
    const isSelected = useStickersStore(s => s.selectedId === id);

    if (!sticker) return null;

    const { x, y, width, height, rotation, fill, stroke, shapeId } = sticker;

    const onTransformEnd = () => {
        const node = shapeRef.current;
        update(id, {
            x: node.x(),
            y: node.y(),
            width: Math.max(20, node.width() * node.scaleX()),
            height: Math.max(20, node.height() * node.scaleY()),
            rotation: node.rotation(),
        });

        node.scaleX(1);
        node.scaleY(1);
    };

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    const common = {
        ref: shapeRef,
        x: 0,
        y: 0,
        width,
        height,
        rotation,
        fill: fill || "#000",
        stroke: stroke || "#000",
        strokeWidth: 2,
        draggable: true,
        onClick: () => select(id),
        onTap: () => select(id),
        onDragEnd: e => update(id, { x: e.target.x(), y: e.target.y() }),
        onTransformEnd,
    };

    const renderShape = () => {
        switch (shapeId) {
            case "square":
                return <Rect {...common} />;
            case "circle":
                return <Circle {...common} radius={width / 2} />;
            case "triangle":
                return (
                    <Line
                        {...common}
                        points={[width / 2, 0, width, height, 0, height]}
                        closed
                    />
                );
            case "star":
                return (
                    <Star
                        {...common}
                        numPoints={5}
                        innerRadius={width * 0.35}
                        outerRadius={width / 2}
                    />
                );
            case "stick":
                return <Rect {...common} width={width} height={height} />;
            case "arrow":
                return (
                    <Arrow
                        {...common}
                        points={[0, height / 2, width, height / 2]}
                        pointerLength={20}
                        pointerWidth={20}
                    />
                );
            case "dblarrow":
                return (
                    <Arrow
                        {...common}
                        points={[0, height / 2, width, height / 2]}
                        pointerLength={20}
                        pointerWidth={20}
                        pointerAtBeginning
                    />
                );
            case "parallelogram":
                return (
                    <Line
                        {...common}
                        points={[40, 0, width, 0, width - 40, height, 0, height]}
                        closed
                    />
                );
            default:
                return <Rect {...common} />;
        }
    };

    return (
        <div style={{ position: "absolute", left: x, top: y, width, height }}>
            <Stage width={width} height={height}>
                <Layer>
                    {renderShape()}
                    {isSelected && <Transformer ref={trRef} rotateEnabled={true} />}
                </Layer>
            </Stage>
        </div>
    );
};

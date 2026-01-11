// ShapeBoardWidget.jsx
import React, { useEffect, useRef, useState } from 'react';
import { ShapeToolbar } from '../components/ShapeToolbar.jsx';
import { Board } from '../features/board/ui/Board.jsx';
import { useStickersStore } from '../entities/stickers/model/useStickersStore.js';
import { shapesApi } from '../shared/api/shapesApi.js';

const SafeFallbackWidget = ({ children }) => <div>{children}</div>;

export const ShapeBoardWidget = () => {
    const setStickers = useStickersStore((state) => state.setStickers);
    const boardRef = useRef(null);
    const [WidgetComp, setWidgetComp] = useState(() => SafeFallbackWidget);

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const [allShapes, boardShapes] = await Promise.all([
                    shapesApi.getAll(),
                    shapesApi.getBoard(),
                ]);
                const shapeKeyByDbId = new Map(allShapes.map((x) => [String(x.id), x.shapeId]));
                let x = 30;
                let y = 30;
                const items = [];
                for (const s of boardShapes) {
                    const w = s.width ?? 140;
                    const h = s.height ?? 140;
                    const r = s.rotation ?? 0;
                    const shapeKey = shapeKeyByDbId.get(String(s.shapeId)) ?? 'square';
                    items.push({
                        id: s.id,
                        stickerId: s.id,
                        type: 'shape',
                        shapeId: shapeKey,
                        shapeDbId: s.shapeId,
                        x,
                        y,
                        width: w,
                        height: h,
                        rotation: r,
                        zIndex: 1,
                        fill: 'transparent',
                        stroke: '#000',
                    });
                    x += 24;
                    y += 24;
                }
                setStickers(items);
            } catch (e) {
                console.warn('Не удалось загрузить доску для фигур:', e);
            }
        };
        loadBoard();
    }, [setStickers]);

    useEffect(() => {
        let mounted = true;
        import('@xyflow/react')
            .then((mod) => {
                if (!mounted) return;
                const candidate = (mod && (mod.Widget || mod.default || mod?.widget || mod?.XyflowWidget)) ?? null;
                if (typeof candidate === 'function' || React.isValidElement(candidate)) {
                    setWidgetComp(() => candidate);
                } else {
                    setWidgetComp(() => SafeFallbackWidget);
                }
            })
            .catch(() => {
                if (mounted) setWidgetComp(() => SafeFallbackWidget);
            });
        return () => { mounted = false; };
    }, []);

    const Wrapper = WidgetComp || SafeFallbackWidget;

    return (
        <Wrapper>
            <div className="relative flex h-screen w-screen bg-gray-100">
                <ShapeToolbar />
                <Board ref={boardRef} />
            </div>
        </Wrapper>
    );
};
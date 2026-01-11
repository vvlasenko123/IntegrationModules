// RoadmapBoardWidget.jsx
import React, { useEffect, useRef, useState } from 'react';
import { RoadmapToolbar } from '../components/RoadmapToolbar.jsx';
import { Board } from '../features/board/ui/Board.jsx';
import { useStickersStore } from '../entities/stickers/model/useStickersStore.js';
import { roadmapApi } from "../shared/api/roadmapApi.js";


const SafeFallbackWidget = ({ children }) => <div>{children}</div>;

export const RoadmapBoardWidget = () => {
    const setStickers = useStickersStore((state) => state.setStickers);
    const setEdges = useStickersStore((state) => state.setEdges);
    const boardRef = useRef(null);
    const [WidgetComp, setWidgetComp] = useState(() => SafeFallbackWidget);

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const roadmaps = await roadmapApi.getAll();
                let x = 30;
                let y = 30;
                const items = [];
                const edges = [];
                for (const r of roadmaps) {
                    const w = r.width ?? 200;
                    const h = r.height ?? 120;
                    items.push({
                        id: String(r.id),
                        type: 'roadmap',
                        x,
                        y,
                        width: w,
                        height: h,
                        text: r.text ?? '',
                        description: r.description ?? '',
                        date: r.date ?? null,
                        completed: r.completed ?? false,
                        cancelled: r.cancelled ?? false,
                        parentId: r.parentId ?? null,
                        zIndex: r.zIndex ?? 1,
                    });
                    if (r.parentId) {
                        edges.push({
                            id: `e-${r.parentId}-${r.id}`,
                            source: String(r.parentId),
                            target: String(r.id),
                            type: 'default',
                            animated: false,
                        });
                    }
                    x += 24;
                    y += 24;
                }
                setStickers(items);
                setEdges(edges);
            } catch (e) {
                console.warn('Не удалось загрузить доску для роадмапа:', e);
            }
        };
        loadBoard();
    }, [setStickers, setEdges]);

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
                <RoadmapToolbar createInCenter={() => {
                    return { x: 300, y: 200 };
                }} />
                <Board ref={boardRef} />
            </div>
        </Wrapper>
    );
};
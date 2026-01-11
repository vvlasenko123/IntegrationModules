// MarkdownBoardWidget.jsx
import React, { useEffect, useRef, useState } from 'react';
import { MarkdownToolbar } from '../components/MarkdownToolbar.jsx';
import { Board } from '../features/board/ui/Board.jsx';
import { useStickersStore } from '../entities/stickers/model/useStickersStore.js';
import { markdownApi } from '../shared/api/markdownApi';

const SafeFallbackWidget = ({ children }) => <div>{children}</div>;

export const MarkdownBoardWidget = () => {
    const setStickers = useStickersStore((state) => state.setStickers);
    const boardRef = useRef(null);
    const [WidgetComp, setWidgetComp] = useState(() => SafeFallbackWidget);

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const boardMarkdowns = await markdownApi.getBoard();
                let x = 30;
                let y = 30;
                const items = [];
                for (const m of boardMarkdowns) {
                    const w = m.width ?? 600;
                    const h = m.height ?? 400;
                    items.push({
                        id: m.id,
                        stickerId: m.markdownId,
                        isEditorVisible: m.isEditorVisible ?? true,
                        type: 'markdown',
                        x,
                        y,
                        width: w,
                        height: h,
                        text: m.content ?? '',
                        zIndex: 1,
                    });
                    x += 24;
                    y += 24;
                }
                setStickers(items);
            } catch (e) {
                console.warn('Не удалось загрузить доску для markdown:', e);
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
                <MarkdownToolbar createInCenter={() => {
                    return { x: 300, y: 200 };
                }}  />
                <Board ref={boardRef} />
            </div>
        </Wrapper>
    );
};
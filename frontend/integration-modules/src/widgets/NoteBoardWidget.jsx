// NoteBoardWidget.jsx
import React, { useEffect, useRef, useState } from 'react';
import { NoteToolbar } from '../components/NoteToolbar.jsx';
import { Board } from '../features/board/ui/Board.jsx';
import { useStickersStore } from '../entities/stickers/model/useStickersStore.js';
import { notesApi } from '../shared/api/notesApi.js';
import { NOTE_W, NOTE_H } from '../features/board/constants';

const SafeFallbackWidget = ({ children }) => <div>{children}</div>;

export const NoteBoardWidget = () => {
    const addSticker = useStickersStore((state) => state.addSticker);
    const setStickers = useStickersStore((state) => state.setStickers);
    const boardRef = useRef(null);
    const [WidgetComp, setWidgetComp] = useState(() => SafeFallbackWidget);

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const notes = await notesApi.getAll();
                let x = 30;
                let y = 30;
                const items = [];
                for (const n of notes) {
                    const w = n.width ?? NOTE_W;
                    const h = n.height ?? NOTE_H;
                    items.push({
                        id: n.id,
                        x,
                        y,
                        color: n.color,
                        width: w,
                        height: h,
                        text: n.content ?? '',
                        zIndex: 1,
                    });
                    x += 24;
                    y += 24;
                }
                setStickers(items);
            } catch (e) {
                console.warn('Не удалось загрузить доску для заметок:', e);
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

    const handlePick = async (color) => {
        try {
            const created = await notesApi.create(color, NOTE_W, NOTE_H);
            const w = created.width ?? NOTE_W;
            const h = created.height ?? NOTE_H;
            if (boardRef.current?.addStickerAtCenter) {
                boardRef.current.addStickerAtCenter(color, {
                    id: created.id,
                    text: created.content ?? '',
                    width: w,
                    height: h,
                });
                return;
            }
            addSticker({
                id: created.id,
                x: 260,
                y: 120,
                color,
                width: w,
                height: h,
                text: created.content ?? '',
            });
        } catch (e) {
            console.warn('Не удалось создать заметку:', e);
        }
    };

    return (
        <Wrapper>
            <div className="relative flex h-screen w-screen bg-gray-100">
                <NoteToolbar onPick={handlePick} />
                <Board ref={boardRef} />
            </div>
        </Wrapper>
    );
};
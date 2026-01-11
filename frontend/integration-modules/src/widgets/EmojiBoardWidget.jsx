// EmojiBoardWidget.jsx
import React, { useEffect, useRef, useState } from 'react';
import { EmojiToolbar } from '../components/EmojiToolbar.jsx';
import { Board } from '../features/board/ui/Board.jsx';
import { useStickersStore } from '../entities/stickers/model/useStickersStore.js';
import { stickersApi } from '../shared/api/stickerApi.js';
import { EMOJI_W, EMOJI_H } from '../features/board/constants';
import { EMOJI_CATALOG, EMOJI_MAP } from "../features/emoji-sticker/stickers.js";

const SafeFallbackWidget = ({ children }) => <div>{children}</div>;

export const EmojiBoardWidget = () => {
    const setStickers = useStickersStore((state) => state.setStickers);
    const boardRef = useRef(null);
    const [WidgetComp, setWidgetComp] = useState(() => SafeFallbackWidget);

    async function getEmojiUrlForStickerId(stickerId) {
        if (EMOJI_MAP && EMOJI_MAP[stickerId]) {
            return EMOJI_MAP[stickerId];
        }
        try {
            const info = await stickersApi.getById(stickerId); // { id, name }
            if (info?.name) {
                const local = EMOJI_CATALOG.find((e) => e.name === info.name);
                if (local) return local.url;
            }
        } catch (err) {
            console.warn('getEmojiUrlForStickerId: backend lookup failed', err);
        }
        return '';
    }

    useEffect(() => {
        const loadBoard = async () => {
            try {
                const boardEmojis = await stickersApi.getBoard();
                let x = 30;
                let y = 30;
                const items = [];
                for (const e of boardEmojis) {
                    const w = e.width ?? EMOJI_W;
                    const h = e.height ?? EMOJI_H;
                    let imageUrl = EMOJI_MAP?.[String(e.stickerId)] ?? '';
                    if (!imageUrl) {
                        try {
                            imageUrl = await getEmojiUrlForStickerId(e.stickerId);
                        } catch (err) {
                            console.warn('Ошибка при получении локального url для stickerId', e.stickerId, err);
                            imageUrl = '';
                        }
                    }
                    items.push({
                        id: e.id,
                        x,
                        y,
                        color: 'transparent',
                        width: w,
                        height: h,
                        text: '',
                        zIndex: 1,
                        stickerId: e.stickerId,
                        imageUrl,
                    });
                    x += 24;
                    y += 24;
                }
                setStickers(items);
            } catch (e) {
                console.warn('Не удалось загрузить доску для эмодзи:', e);
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
                <EmojiToolbar />
                <Board ref={boardRef} />
            </div>
        </Wrapper>
    );
};
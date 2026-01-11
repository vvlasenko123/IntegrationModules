// EmojiToolbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { EMOJI_CATALOG } from '../features/emoji-sticker/stickers.js';
import { stickersApi } from '../shared/api/stickerApi.js';
import { DND_EMOJI } from '../features/board/constants.js';
import emojiAdd from '../assets/emoji_add.svg';
import emojiAddActive from '../assets/emoji_add_active.svg';
import '../styles/stickerPalette.css';

export const EmojiToolbar = () => {
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [emojiItems, setEmojiItems] = useState([]);
    const wrapperRef = useRef(null);

    const toggleEmoji = (e) => {
        e.stopPropagation();
        setEmojiOpen((v) => !v);
    };

    useEffect(() => {
        if (!emojiOpen) return;
        let cancelled = false;
        (async () => {
            const stickers = await stickersApi.getAll();
            if (cancelled) return;
            setEmojiItems(
                stickers
                    .map((s) => {
                        const local = EMOJI_CATALOG.find((e) => e.name === s.name);
                        return local ? { ...s, url: local.url } : null;
                    })
                    .filter(Boolean)
            );
        })();
        return () => { cancelled = true; };
    }, [emojiOpen]);

    useEffect(() => {
        if (!emojiOpen) return;
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setEmojiOpen(false);
            }
        };
        window.addEventListener('pointerdown', handler);
        return () => window.removeEventListener('pointerdown', handler);
    }, [emojiOpen]);

    const onEmojiDragStart = (item) => (e) => {
        e.stopPropagation();
        e.dataTransfer.setData(
            DND_EMOJI,
            JSON.stringify({
                stickerId: item.id,
                name: item.name,
            })
        );
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div className="left-toolbar-container dragHandle__custom" ref={wrapperRef} onClick={(e) => e.stopPropagation()}>
            <div className={`toolbar-card ${emojiOpen ? 'toolbar-card--open' : ''}`}>
                <button onClick={toggleEmoji} className={`toolbar-btn toolbar-btn--icon toolbar-btn--emoji ${emojiOpen ? 'toolbar-btn--active' : ''}`}>
                    <div className={`toolbar-emoji-plate ${emojiOpen ? 'toolbar-emoji-plate--active' : ''}`}>
                        <img src={emojiOpen ? emojiAddActive : emojiAdd} alt="Эмодзи" draggable={false} />
                    </div>
                </button>
            </div>
            {emojiOpen && (
                <div className="palette-wrapper" onClick={(e) => e.stopPropagation()}>
                    <div className="emoji-panel" style={{ width: 300, height: 500 }}>
                        <div className="emoji-panel-header">
                            <span className="emoji-header-title">Стикеры</span>
                        </div>
                        <div className="emoji-grid">
                            {emojiItems.map((item) => (
                                <button
                                    key={item.id}
                                    draggable
                                    onDragStart={onEmojiDragStart(item)}
                                    className="emoji-item"
                                >
                                    <img src={item.url} draggable={false} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
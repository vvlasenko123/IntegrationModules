import React, { useState } from 'react';
import markdownAdd from '../assets/markdown_add.svg';
import markdownAddActive from '../assets/markdown_add_active.svg';
import { useStickersStore } from '../entities/stickers/model/useStickersStore';
import { markdownApi } from '../shared/api/markdownApi';
import '../styles/stickerPalette.css';
import '../features/markdown/markdown.css';

export const MarkdownToolbar = () => {
    const [isCreating, setIsCreating] = useState(false);

    const addSticker = useStickersStore(state => state.addSticker);
    const topZ = useStickersStore(state => state.topZ);

    const createMarkdown = async () => {
        if (isCreating) return;
        setIsCreating(true);

        try {
            const nextZ = (topZ || 1) + 1;

            const created = await markdownApi.create({
                content: '# Новый Markdown\n\nНачните писать здесь...',
                width: 600,
                height: 400,
                isEditorVisible: true
            });

            const centerX = window.innerWidth / 2 - 300;
            const centerY = window.innerHeight / 2 - 200;

            addSticker({
                id: created.id,
                stickerId: created.markdownId,
                isEditorVisible: created.isEditorVisible ?? true,
                type: 'markdown',
                x: centerX,
                y: centerY,
                width: created.width ?? 600,
                height: created.height ?? 400,
                text: created.content ?? '',
                zIndex: nextZ
            });
        } catch (err) {
            console.warn('Не удалось создать markdown блок:', err);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="left-toolbar-container" onClick={e => e.stopPropagation()}>
            <div className="toolbar-card">
                <button
                    onClick={createMarkdown}
                    disabled={isCreating}
                    className={`toolbar-btn toolbar-btn--icon toolbar-btn--markdown ${isCreating ? 'toolbar-btn--active' : ''}`.trim()}
                    title="Добавить Markdown блок"
                >
                    <div className={`toolbar-markdown-plate ${isCreating ? 'toolbar-markdown-plate--active' : ''}`}>
                        <img
                            src={isCreating ? markdownAddActive : markdownAdd}
                            alt="Markdown"
                            draggable={false}
                        />
                    </div>
                </button>
            </div>
        </div>
    );
};
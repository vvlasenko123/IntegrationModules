import React, { useState } from 'react';
import roadmapAdd from '../assets/roadmap_add.svg';
import roadmapAddActive from '../assets/roadmap_add_active.svg';
import { useStickersStore } from '../entities/stickers/model/useStickersStore';
import { roadmapApi } from '../shared/api/roadmapApi.js';
import '../styles/stickerPalette.css';
import '../features/roadmap/roadmap.css';

export const RoadmapToolbar = () => {
    const [isCreating, setIsCreating] = useState(false);

    const addSticker = useStickersStore(state => state.addSticker);
    const topZ = useStickersStore(state => state.topZ);

    const createRoadmap = async () => {
        if (isCreating) return;
        setIsCreating(true);

        try {
            const nextZ = (topZ || 1) + 1;

            const created = await roadmapApi.create({
                text: '',
                description: '',
                date: null,
                completed: false,
                cancelled: false,
                zIndex: nextZ,
                width: 200,
                height: 50,
                parentId: null
            });

            // Добавляем в центр экрана (можно настроить координаты)
            const centerX = window.innerWidth / 2 - 100;  // - половина ширины
            const centerY = window.innerHeight / 2 - 60; // - половина высоты

            addSticker({
                id: String(created.id),
                type: 'roadmap',
                x: centerX,
                y: centerY,
                width: created.width ?? 200,
                height: created.height ?? 120,
                text: created.text ?? '',
                description: created.description ?? '',
                date: created.date ?? null,
                completed: created.completed ?? false,
                cancelled: created.cancelled ?? false,
                parentId: created.parentId ?? null,
                zIndex: created.zIndex ?? nextZ
            });
        } catch (err) {
            console.warn('Не удалось создать roadmap:', err);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="left-toolbar-container" onClick={e => e.stopPropagation()}>
            <div className="toolbar-card">
                <button
                    onClick={createRoadmap}
                    disabled={isCreating}
                    className={`toolbar-btn toolbar-btn--icon toolbar-btn--markdown ${isCreating ? 'toolbar-btn--active' : ''}`}
                    title="Добавить Roadmap"
                >
                    <div className={`toolbar-markdown-plate ${isCreating ? 'toolbar-markdown-plate--active' : ''}`}>
                        <img
                            src={isCreating ? roadmapAddActive : roadmapAdd}
                            alt="Roadmap"
                            draggable={false}
                        />
                    </div>
                </button>
            </div>
        </div>
    );
};
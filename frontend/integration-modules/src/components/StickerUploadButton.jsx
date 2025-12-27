import React, { useRef } from 'react';
import stickerAdd from '../assets/sticker_add.svg';
import { stickersApi } from '../shared/api/stickerApi.js';

export const StickerUploadButton = ({ onStickerUploaded, className = '' }) => {
    const fileInputRef = useRef(null);

    const handleClick = (e) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение');
            e.target.value = '';
            return;
        }

        try {
            await stickersApi.upload(file); // Используем централизованный API

            if (typeof onStickerUploaded === 'function') {
                onStickerUploaded();
            }
        } catch (err) {
            console.error('Ошибка загрузки стикера:', err);
            alert('Не удалось загрузить стикер: ' + err.message);
        } finally {
            e.target.value = '';
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
            />

            <button
                onClick={handleClick}
                className={`sticker-upload-btn ${className}`}
                title="Загрузить свой стикер"
            >
                <img src={stickerAdd} alt="Добавить стикер" draggable={false} />
            </button>
        </>
    );
};
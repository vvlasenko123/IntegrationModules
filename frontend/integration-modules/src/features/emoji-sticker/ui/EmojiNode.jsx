import React, { useState } from 'react'
import { NodeResizer, Handle, Position } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { stickersApi } from '../../../shared/api/stickerApi'
import '../../../styles/sticker.css'

export const EmojiNode = ({ data, selected }) => {
    const sticker = useStickersStore(s =>
        s.stickers.find(x => x.id === data.stickerId)
    )

    if (!sticker || !sticker.imageUrl) return null

    const { setSize, removeSticker, bringToFront } = useStickersStore()

    const [menuVisible, setMenuVisible] = useState(false)
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })

    const onContextMenu = (e) => {
        e.preventDefault()
        e.stopPropagation()

        let x = e.clientX
        let y = e.clientY

        if (x + 140 > window.innerWidth) {
            x = window.innerWidth - 148
        }
        if (y + 40 > window.innerHeight) {
            y = window.innerHeight - 48
        }

        setMenuPos({ x, y })
        setMenuVisible(true)
    }

    const handleDelete = async () => {
        setMenuVisible(false)
        try {
            await stickersApi.removeFromBoard(sticker.id)
            removeSticker(sticker.id)
        } catch {
            alert('Не удалось удалить эмодзи')
        }
    }

    return (
        <>
            <NodeResizer
                isVisible={selected}
                minWidth={30}
                minHeight={30}
                color="#ff0071"

            />

            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />

            <div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }}
                onPointerDown={() => bringToFront(sticker.id)}
                onContextMenu={onContextMenu}
            >
                <img
                    src={sticker.imageUrl}
                    alt=""
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'block',
                        pointerEvents: 'none'
                    }}
                    draggable={false}
                />
            </div>

            {menuVisible && (
                <div
                    className="sticker-context-menu"
                    style={{
                        position: 'fixed',
                        left: menuPos.x,
                        top: menuPos.y
                    }}
                >
                    <button
                        className="sticker-context-menu__item"
                        onClick={handleDelete}
                    >
                        Удалить
                    </button>
                </div>
            )}
        </>
    )
}

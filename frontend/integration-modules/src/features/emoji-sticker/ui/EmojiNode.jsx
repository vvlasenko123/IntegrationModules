import React, {useEffect, useState} from 'react'
import { NodeResizer, Handle, Position } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { stickersApi } from '../../../shared/api/stickerApi'
import '../../../styles/sticker.css'

export const EmojiNode = ({ id, selected }) => {
    const sticker = useStickersStore(s =>
        s.stickers.find(x => String(x.id) === String(id))
    )

    const updateSticker = useStickersStore(s => s.updateSticker)
    const removeSticker = useStickersStore(s => s.removeSticker)
    const bringToFront = useStickersStore(s => s.bringToFront)

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
            await stickersApi.removeFromBoard(id)
            removeSticker(id)
        } catch {
            alert('Не удалось удалить эмодзи')
        }
    }

    useEffect(() => {
        const handleClose = () => setMenuVisible(false)
        document.addEventListener('click', handleClose)
        return () => document.removeEventListener('click', handleClose)
    }, [])

    if (!sticker || !sticker.imageUrl) {
        return null
    }

    return (
        <>
            <NodeResizer
                isVisible={selected}
                minWidth={30}
                minHeight={30}
                onResizeEnd={async (_, params) => {
                    const w = Math.max(1, Math.round(params.width))
                    const h = Math.max(1, Math.round(params.height))

                    updateSticker(id, { width: w, height: h })

                    try {
                        await stickersApi.updateBoardSize(id, w, h)
                    } catch (e) {
                        console.warn('Не удалось сохранить размер эмодзи', e)
                    }
                }}
            />

            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />

            <div
                style={{ width: '100%', height: '100%', position: 'relative' }}
                onPointerDown={() => { bringToFront(id) }}
                onContextMenu={onContextMenu}
            >
                <img
                    src={sticker.imageUrl}
                    alt=""
                    style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
                    draggable={false}
                />
            </div>

            {menuVisible && (
                <div
                    style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        padding: 2,
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <button
                        style={{
                            border: 'none',
                            background: 'none',
                            padding: '3px 7px',
                            cursor: 'pointer',
                            fontSize: 12,
                            color: '#3c3c3c'
                        }}
                        onClick={handleDelete}
                    >
                        Удалить
                    </button>
                </div>
            )}
        </>
    )
}

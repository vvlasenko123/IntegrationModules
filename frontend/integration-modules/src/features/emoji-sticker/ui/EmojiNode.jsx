import React from 'react'
import { NodeResizer, Handle, Position } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import '../../../styles/sticker.css'
import {stickersApi} from "../../../shared/api/stickerApi.js";

export const EmojiNode = ({ id, selected }) => {
    const sticker = useStickersStore(s =>
        s.stickers.find(x => String(x.id) === String(id))
    )

    const bringToFront = useStickersStore(s => s.bringToFront)
    const updateSticker = useStickersStore(s => s.updateSticker)

    if (!sticker || !sticker.imageUrl) return null

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
                        await stickersApi.updateTransform(id, w, h)
                    } catch (e) {
                        console.warn('Не удалось сохранить размер эмодзи', e)
                    }
                }}
            />

            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />

            <div
                style={{ width: sticker.width, height: sticker.height, position: 'relative' }}
                onPointerDown={() => bringToFront(id)}
            >
                <img
                    src={sticker.imageUrl}
                    draggable={false}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </>
    )
}

import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { SHAPES } from '../../shape/constants.jsx'
import { DND_SHAPE } from '../constants'
import { shapesApi } from '../../../shared/api/shapesApi.js'

let cachedShapes = null

async function getShapesCached() {
    if (cachedShapes) return cachedShapes
    cachedShapes = await shapesApi.getAll()
    return cachedShapes
}

export const useShapeDrop = () => {
    const addSticker = useStickersStore(s => s.addSticker)
    const topZ = useStickersStore(s => s.topZ)

    return async (e, scrollLeft, scrollTop, rect, user, board) => {
        const raw = e.dataTransfer.getData(DND_SHAPE)
        if (!raw) return

        let shapeKey
        try {
            shapeKey = JSON.parse(raw).shapeId
        } catch {
            console.warn('DND_SHAPE: не удалось распарсить payload')
            return
        }

        const uiShape = SHAPES.find(s => s.id === shapeKey)
        if (!uiShape) {
            console.warn('DND_SHAPE: фигура не найдена в SHAPES:', shapeKey)
            return
        }

        const allShapes = await getShapesCached()
        const backendShape = allShapes.find(x => x.shapeId === shapeKey)
        if (!backendShape?.id) {
            console.warn('DND_SHAPE: на бэке нет shapeId =', shapeKey, 'getAll:', allShapes)
            return
        }

        const w = uiShape.defaultSize.width
        const h = uiShape.defaultSize.height
        const rotation = 0
        const x = Math.round(scrollLeft + e.clientX - rect.left - w / 2)
        const y = Math.round(scrollTop + e.clientY - rect.top - h / 2)
        const nextZ = (topZ || 1) + 1

        try {
            const created = await shapesApi.addToBoard(backendShape.id, w, h, rotation)


            addSticker({
                id: created.id,
                stickerId: created.id,
                type: 'shape',
                shapeId: shapeKey,
                shapeDbId: created.shapeId,
                x: Math.max(0, x),
                y: Math.max(0, y),
                width: created.width ?? w,
                height: created.height ?? h,
                rotation: created.rotation ?? rotation,
                zIndex: nextZ,
                fill: 'transparent',
                stroke: '#000',

            })
        } catch (err) {
            console.warn('Не удалось сохранить фигуру на доске:', err)
        }

    }
}

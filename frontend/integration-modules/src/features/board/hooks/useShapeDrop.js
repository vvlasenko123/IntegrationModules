import { useStickersStore } from '../../../entities/stickers/model/useStickersStore.js'
import { SHAPES } from '../../shape/constants.jsx'
import { DND_SHAPE } from '../constants'

export const useShapeDrop = () => {
    const addSticker = useStickersStore(s => s.addSticker)
    const topZ = useStickersStore(s => s.topZ)

    return (e, scrollLeft, scrollTop, rect) => {
        const raw = e.dataTransfer.getData(DND_SHAPE)
        if (!raw) return

        let shapeId
        try {
            shapeId = JSON.parse(raw).shapeId
        } catch {
            return
        }

        const shape = SHAPES.find(s => s.id === shapeId)
        if (!shape) return

        const x = Math.round(
            scrollLeft +
            e.clientX -
            rect.left -
            shape.defaultSize.width / 2
        )
        const y = Math.round(
            scrollTop +
            e.clientY -
            rect.top -
            shape.defaultSize.height / 2
        )

        addSticker({
            id: `shape-${Date.now()}`,
            type: 'shape',
            shapeId,
            x: Math.max(0, x),
            y: Math.max(0, y),
            width: shape.defaultSize.width,
            height: shape.defaultSize.height,
            rotation: 0,
            zIndex: (topZ || 1) + 1,
            fill: '#000',
            stroke: '#000',
        })
    }
}

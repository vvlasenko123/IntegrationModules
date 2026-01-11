import React, { useEffect, useRef } from 'react'
import "../../features/roadmap/roadmap.css"
import { RoadmapToolbar } from './RoadmapToolbar.jsx'
import { Board } from '../../features/board/ui/Board.jsx'
import { useStickersStore } from '../../entities/stickers/model/useStickersStore.js'
import { roadmapApi } from '../../shared/api/roadmapApi.js'

export const RoadmapBoardWidget = () => {
    const addStickers = useStickersStore(s => s.addStickers)
    const addSticker = useStickersStore(s => s.addSticker)
    const setEdges = useStickersStore(s => s.setEdges)
    const boardRef = useRef(null)
    const createRoadmap = async () => {
        try {
            const nextZ = 1
            const created = await roadmapApi.create({
                text: '',
                description: '',
                date: null,
                completed: false,
                cancelled: false,
                zIndex: nextZ,
                width: 200,
                height: 120,
                parentId: null
            })

            if (!created) return

            addSticker({
                id: String(created.id),
                type: 'roadmap',
                x: 260,
                y: 120,
                width: created.width ?? 200,
                height: created.height ?? 120,
                text: created.text ?? '',
                description: created.description ?? '',
                date: created.date ?? null,
                completed: created.completed ?? false,
                cancelled: created.cancelled ?? false,
                parentId: created.parentId ?? null,
                zIndex: created.zIndex ?? nextZ
            })
        } catch (err) {
            console.warn('RoadmapBoardWidget:create failed', err)
        }
    }

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const roadmaps = await roadmapApi.getAll()
                if (cancelled) return
                let x = 30, y = 30
                const items = []
                const edges = []
                for (const r of roadmaps) {
                    const w = r.width ?? 200
                    const h = r.height ?? 120
                    items.push({
                        id: String(r.id),
                        type: 'roadmap',
                        x, y,
                        width: w,
                        height: h,
                        text: r.text ?? '',
                        description: r.description ?? '',
                        date: r.date ?? null,
                        completed: r.completed ?? false,
                        cancelled: r.cancelled ?? false,
                        parentId: r.parentId ?? null,
                        zIndex: r.zIndex ?? 1
                    })
                    if (r.parentId) {
                        edges.push({
                            id: `e-${r.parentId}-${r.id}`,
                            source: String(r.parentId),
                            target: String(r.id),
                            type: 'default',
                            animated: false
                        })
                    }
                    x += 24; y += 24
                }
                addStickers(items)
                setEdges(edges)
            } catch (err) {
                console.warn('RoadmapBoardWidget: failed to load', err)
            }
        })()
        return () => { cancelled = true }
    }, [addStickers, setEdges])

    return (
        <div className="relative flex h-screen w-screen bg-gray-100">
            <RoadmapToolbar onCreateClick={createRoadmap} />
            <Board ref={boardRef} />
        </div>
    )
}

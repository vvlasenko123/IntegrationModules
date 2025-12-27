import { useCallback, useEffect } from 'react'
import { useNodesState, useEdgesState, applyNodeChanges, addEdge } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'

export function useBoardFlow() {
    const stickers = useStickersStore(s => s.stickers)
    const storeEdges = useStickersStore(s => s.edges)

    const [nodes, setNodes] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const onNodesChange = useCallback((changes) => {
        setNodes(nds => applyNodeChanges(changes, nds))

        for (const change of changes) {
            if (change.type === 'dimensions' && change.resizing === false) {
                useStickersStore.getState().setSize(
                    change.id,
                    change.dimensions.width,
                    change.dimensions.height
                )
            }

            if (change.type === 'position' && change.dragging === false) {
                useStickersStore.getState().setPosition(
                    change.id,
                    Math.round(change.position.x),
                    Math.round(change.position.y)
                )
            }
        }
    }, [setNodes])

    const onConnect = useCallback((params) => {
        useStickersStore.setState(state => ({
            edges: addEdge(params, state.edges)
        }))
    }, [])

    useEffect(() => {
        const mapped = stickers.map(s => ({
            id: String(s.id),
            type:
                s.type === 'roadmap'
                    ? 'roadmap'
                    : s.type === 'shape'
                        ? 'shape'
                        : s.type === 'markdown'
                            ? 'markdown'
                            : s.imageUrl
                                ? 'emoji'
                                : 'note',
            position: { x: s.x || 0, y: s.y || 0 },
            data: { stickerId: s.id },
            style: {
                width: s.width,
                height: s.height,
                zIndex: s.zIndex,
                pointerEvents: 'auto',
            },
            draggable: true,
            selectable: true,
        }))

        setNodes(mapped)
    }, [
        stickers.map(s => `${s.id}:${s.x}:${s.y}:${s.width}:${s.height}:${s.zIndex}`).join('|'),
        setNodes
    ])

    useEffect(() => {
        setEdges(storeEdges)
    }, [
        storeEdges.map(e => `${e.id}:${e.source}:${e.target}`).join('|'),
        setEdges
    ])

    return {
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        onConnect,
    }
}
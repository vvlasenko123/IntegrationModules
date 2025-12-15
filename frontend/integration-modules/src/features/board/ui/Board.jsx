import React, { forwardRef, useRef, useEffect, useCallback } from 'react'
import {
    ReactFlowProvider,
    ReactFlow,
    addEdge,
    useNodesState,
    useEdgesState,
    applyNodeChanges
} from '@xyflow/react'

import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { useDropHandler } from '../hooks/useDropHandler'
import {
    DND_NOTE,
    DND_EMOJI,
    DND_SHAPE,
    DND_CODE,
    BOARD_SAFE_PAD
} from '../constants'

import { NoteNode } from '../../note/ui/NoteNode.jsx'
import { EmojiNode } from '../../emoji-sticker/ui/EmojiNode.jsx'
import { ShapeNode } from '../../shape/ui/ShapeNode.jsx'
import { CodeNode } from '../../code-block/ui/CodeNode.jsx'
import { BoardContext } from './BoardContext.jsx'

const nodeTypes = {
    note: NoteNode,
    emoji: EmojiNode,
    shape: ShapeNode,
    code: CodeNode
}

export const Board = forwardRef((_, ref) => {
    const boardRef = useRef(null)

    const stickers      = useStickersStore(s => s.stickers)
    const addSticker    = useStickersStore(s => s.addSticker)
    const topZ          = useStickersStore(s => s.topZ)
    const selectSticker = useStickersStore(s => s.selectSticker)
    const setPosition   = useStickersStore(s => s.setPosition)

    const handleDropGlobal = useDropHandler(boardRef)

    const [nodes, setNodes] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds))

        for (const change of changes) {
            if (
                change.type === 'dimensions' &&
                change.resizing === false
            ) {
                useStickersStore
                    .getState()
                    .setSize(
                        change.id,
                        change.dimensions.width,
                        change.dimensions.height
                    )
            }

            if (change.type === 'position' && change.dragging === false) {
                useStickersStore
                    .getState()
                    .setPosition(
                        change.id,
                        Math.round(change.position.x),
                        Math.round(change.position.y)
                    )
            }
        }
    }, [])

    useEffect(() => {
        const mapped = stickers.map(s => ({
            id: String(s.id),
            type:
                s.type === 'shape' ? 'shape' :
                    s.type === 'code' ? 'code' :
                        s.imageUrl ? 'emoji' : 'note',
            position: { x: s.x || 0, y: s.y || 0 },
            data: {
                stickerId: s.id, // ← только id
            },
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
        stickers.map(s => `${s.id}:${s.x}:${s.y}:${s.width}:${s.height}:${s.zIndex}`).join('|')
    ])

    // Expose public methods
    React.useImperativeHandle(ref, () => ({
        addStickerAtCenter: (color = '#FFF9C4', opts = {}) => {
            const board = boardRef.current
            const x = board
                ? Math.round(board.scrollLeft + board.clientWidth / 2 - (opts.width ?? 160) / 2)
                : 260
            const y = board
                ? Math.round(board.scrollTop + board.clientHeight / 2 - (opts.height ?? 160) / 2)
                : 120
            addSticker({
                id: opts.id,
                x,
                y,
                width: opts.width ?? 160,
                height: opts.height ?? 160,
                text: opts.text ?? '',
                color,
                zIndex: (topZ || 1) + 1
            })
        }
    }))


    const onNodeClick = useCallback((_, node) => {
        selectSticker(node.id)
    }, [selectSticker])

    const onConnect = useCallback((params) => {
        setEdges(eds => addEdge(params, eds))
    }, [setEdges])

    const onDragOver = useCallback((e) => {
        const types = Array.from(e.dataTransfer?.types || [])
        if ([DND_NOTE, DND_EMOJI, DND_SHAPE, DND_CODE].some(t => types.includes(t))) {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        }
    }, [])

    const onDrop = useCallback((e) => {
        const boardEl = boardRef.current
        if (!boardEl) return
        const rect = boardEl.getBoundingClientRect()
        handleDropGlobal(e, boardEl.scrollLeft, boardEl.scrollTop, rect)
    }, [handleDropGlobal])

    useEffect(() => {
        const handleClickOutside = (e) => {
            // Если клик не на ноде
            if (!e.target.closest('.react-flow__node')) {
                selectSticker(null); // сброс выделения
            }
        };

        const boardEl = boardRef.current;
        boardEl?.addEventListener('click', handleClickOutside);

        return () => {
            boardEl?.removeEventListener('click', handleClickOutside);
        };
    }, [selectSticker]);

    return (
        <BoardContext.Provider value={boardRef}>
            <div
                ref={boardRef}
                className="flex-1 relative bg-white m-4 rounded shadow-sm overflow-auto"
                data-board="true"
                style={{ minHeight: 400, padding: BOARD_SAFE_PAD }}
            >
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={onNodeClick}
                        onConnect={onConnect}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        fitView={false}
                        panOnScroll
                        panOnDrag
                    />
                </ReactFlowProvider>
            </div>
        </BoardContext.Provider>
    )
})

import React, { forwardRef, useRef } from 'react'
import { ReactFlowProvider, ReactFlow } from '@xyflow/react'
import { useDropHandler } from '../hooks/useDropHandler'
import { BOARD_SAFE_PAD } from '../constants'
import { BoardContext } from './BoardContext.jsx'
import { nodeTypes } from '../nodeTypes.js'
import { useBoardFlow } from '../hooks/useBoardFlow.js'
import { useBoardInteractions } from '../hooks/useBoardInteractions'
import { useBoardApi } from '../hooks/useBoardApi'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'

export const Board = forwardRef((_, ref) => {
    const boardRef = useRef(null)

    const selectSticker = useStickersStore(s => s.selectSticker)
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect
    } = useBoardFlow()

    const handleDropGlobal = useDropHandler(boardRef)
    const { onDragOver, onDrop } = useBoardInteractions(boardRef, handleDropGlobal, selectSticker)
    useBoardApi(ref, boardRef)

    const onNodeClick = (_, node) => selectSticker(node.id)

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
                        noDragClassName="nodrag"
                        noPanClassName="nopan"
                    />
                </ReactFlowProvider>
            </div>
        </BoardContext.Provider>
    )
})

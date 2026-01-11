import React, { useEffect, useRef } from 'react'
import { NoteToolbar } from './NoteToolbar.jsx'
import { Board } from '../../features/board/ui/Board.jsx'
import { useStickersStore } from '../../entities/stickers/model/useStickersStore.js'
import { notesApi } from '../../shared/api/notesApi.js'
import { NOTE_W, NOTE_H } from '../../features/board/constants'

export const NoteBoardWidget = () => {
    const setStickers = useStickersStore(s => s.setStickers)
    const addSticker = useStickersStore(s => s.addSticker)
    const boardRef = useRef(null)

    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const notes = await notesApi.getAll()
                if (cancelled) return
                let x = 30, y = 30
                const items = notes.map(n => {
                    const w = n.width ?? NOTE_W
                    const h = n.height ?? NOTE_H
                    const item = {
                        id: n.id,
                        x,
                        y,
                        color: n.color,
                        width: w,
                        height: h,
                        text: n.content ?? '',
                        type: 'note',
                        zIndex: 1
                    }
                    x += 24
                    y += 24
                    return item
                })
                setStickers(items)
            } catch (err) {
                console.warn('NoteBoardWidget: failed to load notes', err)
            }
        })()
        return () => { cancelled = true }
    }, [setStickers])

    const handlePick = async (color) => {
        try {
            const created = await notesApi.create(color, NOTE_W, NOTE_H)
            const w = created.width ?? NOTE_W
            const h = created.height ?? NOTE_H

            if (boardRef.current?.addStickerAtCenter) {
                boardRef.current.addStickerAtCenter(color, {
                    id: created.id,
                    text: created.content ?? '',
                    width: w,
                    height: h
                })
                return
            }

            addSticker({
                id: created.id,
                x: 260,
                y: 120,
                color,
                width: w,
                height: h,
                text: created.content ?? ''
            })
        } catch (e) {
            console.warn('NoteBoardWidget: failed to create note', e)
        }
    }

    return (
        <div className="relative flex h-screen w-screen bg-gray-100">
            <NoteToolbar onPick={handlePick} />
            <Board ref={boardRef} />
        </div>
    )
}

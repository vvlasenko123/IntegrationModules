import { Handle, Position, NodeResizer } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import '../roadmap.css'

import DateIcon from '../../../assets/icons/date.svg?react'
import CancelIcon from '../../../assets/icons/cancel_btn.svg?react'
import CancelActiveIcon from '../../../assets/icons/cancel_btn_active.svg?react'
import DeleteIcon from '../../../assets/icons/delete_btn.svg?react'

export const RoadmapNode = ({ data, selected }) => {
    const sticker = useStickersStore(s => s.stickers.find(x => x.id === data.stickerId))
    const addRoadmapBranch = useStickersStore(s => s.addRoadmapBranch)
    const updateSticker = useStickersStore(s => s.updateSticker)
    const removeSticker = useStickersStore(s => s.removeSticker)
    const bringToFront = useStickersStore(s => s.bringToFront)
    const [showCalendar, setShowCalendar] = useState(false)

    if (!sticker) return null

    const isCompleted = sticker.completed
    const isCancelled = sticker.cancelled
    const hasDate = !!sticker.date

    return (
        <div
            onPointerDown={() => bringToFront(sticker.id)}
            className={`
        group node
        ${isCompleted ? 'nodeCompleted' : ''}
        ${isCancelled ? 'nodeCancelled' : ''}
        ${selected ? 'nodeSelected' : ''}
      `}
            style={{ zIndex: sticker.zIndex }}
        >
            <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-3 !h-3 !left-[-6px] !border-2 !border-white" />
            <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-3 !h-3 !right-[-6px] !border-2 !border-white" />

            {/* Стрелка календаря — вверху слева */}
            <button
                onClick={e => { e.stopPropagation(); setShowCalendar(!showCalendar) }}
                className="dropdownArrow iconButton"
            >
                <DateIcon className="w-5 h-5" />
            </button>

            {/* Кнопки управления — вверху справа */}
            <div className="actionButtons">
                <button
                    onClick={e => { e.stopPropagation(); updateSticker(sticker.id, { cancelled: !isCancelled }) }}
                    className="iconButton"
                >
                    {isCancelled ? <CancelActiveIcon className="w-6 h-6" /> : <CancelIcon className="w-6 h-6" />}
                </button>

                <button
                    onClick={e => { e.stopPropagation(); removeSticker(sticker.id) }}
                    className="iconButton"
                >
                    <DeleteIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Большая текстовая область — ниже кнопок */}
            <textarea
                className={`
          textContent
          ${isCompleted ? 'textCompleted' : isCancelled ? 'textCancelled' : ''}
        `}
                placeholder="type here..."
                value={sticker.text || ''}
                onChange={e => updateSticker(sticker.id, { text: e.target.value })}
                onPointerDown={e => e.stopPropagation()}
                rows={6}
            />

            {/* Дедлайн — внизу слева */}
            {hasDate && (
                <div className="dateFooter">
          <span className="dateLabel">
            {format(new Date(sticker.date), 'd MMM yyyy', { locale: ru })}
          </span>

                    <button
                        onClick={e => { e.stopPropagation(); updateSticker(sticker.id, { completed: !isCompleted }) }}
                        className={`statusCircle ${isCompleted ? 'statusCompleted' : 'statusInProgress'}`}
                    >
                        {isCompleted && <span className="text-sm font-bold">✓</span>}
                    </button>
                </div>
            )}

            {/* Кнопка + */}
            <button
                onClick={e => { e.stopPropagation(); if (!isCancelled) addRoadmapBranch(sticker.id) }}
                disabled={isCancelled}
                className={`plusButton ${isCancelled ? 'plusButtonDisabled' : ''}`}
            >
                +
            </button>

            {/* Календарь справа */}
            {showCalendar && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-6 z-50">
                    <DatePicker
                        selected={sticker.date ? new Date(sticker.date) : new Date()}
                        onChange={date => {
                            if (date) updateSticker(sticker.id, { date: date.toISOString() })
                            setShowCalendar(false)
                        }}
                        inline
                        locale={ru}
                        calendarClassName="shadow-2xl border rounded-2xl bg-white"
                    />
                </div>
            )}

            {selected && <NodeResizer minWidth={340} minHeight={180} />}
        </div>
    )
}
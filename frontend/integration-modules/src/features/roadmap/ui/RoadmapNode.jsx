import { Handle, Position, NodeResizer } from '@xyflow/react'
import { useStickersStore } from '../../../entities/stickers/model/useStickersStore'
import { useRef, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import '../roadmap.css'

import DateIcon from '../../../assets/icons/date.svg?react'
import CancelIcon from '../../../assets/icons/cancel_btn.svg?react'
import CancelActiveIcon from '../../../assets/icons/cancel_btn_active.svg?react'
import DeleteIcon from '../../../assets/icons/delete_btn.svg?react'
import Calendar from '../../../assets/icons/calendar.svg?react'

export const RoadmapNode = ({ data, selected }) => {
    const sticker = useStickersStore(s => s.stickers.find(x => x.id === data.stickerId))
    const addRoadmapBranch = useStickersStore(s => s.addRoadmapBranch)
    const updateSticker = useStickersStore(s => s.updateSticker)
    const removeSticker = useStickersStore(s => s.removeSticker)
    const bringToFront = useStickersStore(s => s.bringToFront)
    const menuRef = useRef(null)
    const [showMenu, setShowMenu] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)

    if (!sticker) return null

    const isCompleted = sticker.completed
    const isCancelled = sticker.cancelled
    const hasDate = !!sticker.date
    useEffect(() => {
        if (!showMenu) return

        const handlePointerDown = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setShowMenu(false)
                setShowCalendar(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
        }
    }, [showMenu])

    return (
        <div
            onPointerDown={() => bringToFront(sticker.id)}
            className={`
        group node relative overflow-visible
        ${isCompleted ? 'nodeCompleted' : ''}
        ${isCancelled ? 'nodeCancelled' : ''}
        ${selected ? 'nodeSelected' : ''}
      `}
            style={{ zIndex: sticker.zIndex }}
        >
            <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-3 !h-3 !left-[-6px] !border-2 !border-white" />
            <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-3 !h-3 !right-[-6px] !border-2 !border-white" />

            <button
                onPointerDown={e => {
                    e.stopPropagation()
                    setShowMenu(prev => !prev)
                    setShowCalendar(false)
                }}
                className="dropdownArrow iconButton"
            >
                <DateIcon
                    className={`w-5 h-5 transition-transform duration-200 ${
                        showMenu ? 'rotate-180' : ''
                    }`}
                />
            </button>

            <div className="actionButtons">
                <button onClick={e => { e.stopPropagation(); updateSticker(sticker.id, { cancelled: !isCancelled }) }} className="iconButton">
                    {isCancelled ? <CancelActiveIcon className="w-6 h-6" /> : <CancelIcon className="w-6 h-6" />}
                </button>
                <button onClick={e => { e.stopPropagation(); removeSticker(sticker.id) }} className="iconButton">
                    <DeleteIcon className="w-6 h-6" />
                </button>
            </div>

            <textarea
                className={`textContent ${isCompleted ? 'textCompleted' : isCancelled ? 'textCancelled' : ''}`}
                placeholder="type here..."
                value={sticker.text || ''}
                onChange={e => updateSticker(sticker.id, { text: e.target.value })}
                onPointerDown={e => e.stopPropagation()}
                rows={6}
            />

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

            <button
                onClick={e => { e.stopPropagation(); if (!isCancelled) addRoadmapBranch(sticker.id) }}
                disabled={isCancelled}
                className={`plusButton ${isCancelled ? 'plusButtonDisabled' : ''}`}
            >
                +
            </button>

            {showMenu && (
                <div
                    ref={menuRef}
                    className="
                        detailMenu
                        absolute left-1/2 top-full mt-2
                        -translate-x-1/2
                        w-[200px]
                        border
                        shadow-[0_8px_24px_rgba(0,0,0,0.06)]
                        z-50
                      "
                    onPointerDown={e => e.stopPropagation()}
                >
                    <div className="px-5 pt-4 pb-5 space-y-4 rounded-3xl">
                        <div className="relative">
                            <button
                                onPointerDown={e => {
                                    e.stopPropagation()
                                    setShowCalendar(prev => !prev)
                                }}
                                className="
        dateButton
        w-full flex items-center justify-between
        px-4 py-3
        text-[15px] font-medium text-gray-800
        bg-gray-10
        hover:bg-gray-50
        transition
    "
                            >
    <span className="font-mono text-[13px] tracking-tight text-gray-700">
        {sticker.date
            ? format(new Date(sticker.date), 'd MMM yyyy', { locale: ru })
            : 'Выбрать дату'}
    </span>

                                <Calendar className="w-3 h-3 text-gray-500" />
                            </button>

                            {/* Календарь слева от кнопки */}
                            {showCalendar && (
                                <div
                                    className="
            absolute top-1/2 -translate-y-1/2
            right-full mr-2
            z-50
            scale-95
            bg-white
            rounded-2xl
            shadow-xl
            border border-gray-200
            overflow-hidden
        "
                                    onPointerDown={e => e.stopPropagation()}
                                >
                                    <DatePicker
                                        selected={sticker.date ? new Date(sticker.date) : null}
                                        onChange={date => {
                                            updateSticker(sticker.id, {
                                                date: date ? date.toISOString() : null,
                                                completed: false
                                            })
                                            setShowCalendar(false)
                                        }}
                                        inline
                                        locale={ru}
                                        calendarClassName="border-0 shadow-none"
                                    />

                                    {/* КНОПКА ОТМЕНЫ */}
                                    <button
                                        onPointerDown={e => {
                                            e.stopPropagation()
                                            updateSticker(sticker.id, {
                                                date: null,
                                                completed: false
                                            })
                                            setShowCalendar(false)
                                        }}
                                        className="dateCancel"
                                    >
                                        Убрать дедлайн
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Заголовок "Описание" */}
                        <div className="about text-sm font-medium text-gray-700 px-2">
                            Описание
                        </div>

                        {/* Большое поле описания */}
                        <textarea
                            className=" textPlace
    w-full min-h-[120px]
    box-border
    px-4 py-3
    rounded-xl
    bg-gray-20
    text-[15px] text-gray-800
    resize-none
    outline-none
    placeholder-gray-400
    focus:bg-white
    focus:ring-1 focus:ring-gray-300
    transition
  "
                            placeholder="Текст..."
                            value={sticker.description || ''}
                            onChange={e =>
                                updateSticker(sticker.id, { description: e.target.value })
                            }
                        />
                    </div>
                </div>
            )}

            {selected && <NodeResizer minWidth={140} minHeight={30} />}
        </div>
    )
}

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
import Calendar from '../../../assets/icons/calendar.svg?react'
import { roadmapApi } from '../../../shared/api/roadmapApi.js'

export const RoadmapNode = ({ data, selected }) => {
    const sticker = useStickersStore(s => s.stickers.find(x => x.id === data.stickerId))
    const addRoadmapBranch = useStickersStore(s => s.addRoadmapBranch)
    const updateSticker = useStickersStore(s => s.updateSticker)
    const bringToFront = useStickersStore(s => s.bringToFront)
    const [showMenu, setShowMenu] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        if (!showMenu) return

        const handlePointerDown = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false)
                setShowCalendar(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [showMenu])

    if (!sticker) return null

    const isCompleted = sticker.completed
    const isCancelled = sticker.cancelled
    const hasDate = !!sticker.date

    const handleToggleCancelled = async (e) => {
        e.stopPropagation()
        const next = !sticker.cancelled
        updateSticker(sticker.id, { cancelled: next })
        try {
            await roadmapApi.updateCancelled(sticker.id, next)
        } catch (err) {
            updateSticker(sticker.id, { cancelled: sticker.cancelled })
            console.warn('Не удалось сохранить cancelled', err)
        }
    }

    const handleToggleCompleted = async (e) => {
        e.stopPropagation()
        const next = !sticker.completed
        updateSticker(sticker.id, { completed: next })
        try {
            await roadmapApi.updateCompleted(sticker.id, next)
        } catch (err) {
            updateSticker(sticker.id, { completed: sticker.completed })
            console.warn('Не удалось сохранить completed', err)
        }
    }

    const handleTextBlur = async (e) => {
        const value = e.currentTarget.value ?? ''
        try {
            await roadmapApi.updateText(sticker.id, value)
        } catch (err) {
            console.warn('Не удалось сохранить текст roadmap', err)
        }
    }

    const handleDescriptionBlur = async (e) => {
        const value = e.currentTarget.value ?? ''
        try {
            await roadmapApi.updateDescription(sticker.id, value)
        } catch (err) {
            console.warn('Не удалось сохранить описание roadmap', err)
        }
    }

    const handleDateChange = async (date) => {
        const iso = date ? date.toISOString() : null
        updateSticker(sticker.id, { date: iso, completed: false })
        try {
            await roadmapApi.updateDate(sticker.id, iso, false)
        } catch (err) {
            console.warn('Не удалось сохранить дату roadmap', err)
        }
    }

    const handleDateClear = async (e) => {
        e.stopPropagation()
        updateSticker(sticker.id, { date: null, completed: false })
        try {
            await roadmapApi.updateDate(sticker.id, null, false)
        } catch (err) {
            console.warn('Не удалось убрать дату roadmap', err)
        }
    }

    return (
        <div
            onPointerDown={() => bringToFront(sticker.id)}
            className={`group node relative overflow-visible dragHandle__custom
                ${isCompleted ? 'nodeCompleted' : ''}
                ${isCancelled ? 'nodeCancelled' : ''}
                ${selected ? 'nodeSelected' : ''}`}
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
                <DateIcon className={`w-5 h-5 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            <div className="actionButtons">
                <button onClick={handleToggleCancelled} className="iconButton">
                    {isCancelled ? <CancelActiveIcon className="w-6 h-6" /> : <CancelIcon className="w-6 h-6" />}
                </button>
            </div>

            <div className="textWrapper">
                <textarea
                    className={`textContent ${isCompleted ? 'textCompleted' : isCancelled ? 'textCancelled' : ''}`}
                    placeholder="type here..."
                    value={sticker.text || ''}
                    onChange={e => updateSticker(sticker.id, { text: e.target.value })}
                    onBlur={handleTextBlur}
                    onPointerDown={e => e.stopPropagation()}
                />
            </div>

            {hasDate && (
                <div className="dateFooter">
                    <span className="dateLabel">
                        {format(new Date(sticker.date), 'd MMM yyyy', { locale: ru })}
                    </span>
                    <button
                        onClick={handleToggleCompleted}
                        className={`statusCircle ${isCompleted ? 'statusCompleted' : 'statusInProgress'}`}
                    >
                        {isCompleted && <span className="text-sm font-bold">✓</span>}
                    </button>
                </div>
            )}

            <button
                onClick={(e) => {
                    e.stopPropagation()
                    if (!isCancelled) void addRoadmapBranch(sticker.id)
                }}
                disabled={isCancelled}
                className={`plusButton ${isCancelled ? 'plusButtonDisabled' : ''}`}
            >
                +
            </button>

            {showMenu && (
                <div
                    ref={menuRef}
                    className="detailMenu absolute left-1/2 top-full mt-2 -translate-x-1/2 w-[200px] border shadow-[0_8px_24px_rgba(0,0,0,0.06)] z-50"
                    onPointerDown={e => e.stopPropagation()}
                >
                    <div className="px-5 pt-4 pb-5 space-y-4 rounded-3xl">
                        <div className="relative">
                            <button
                                onPointerDown={e => {
                                    e.stopPropagation()
                                    setShowCalendar(prev => !prev)
                                }}
                                className="dateButton w-full flex items-center justify-between px-4 py-3 text-[15px] font-medium text-gray-800 bg-gray-10 hover:bg-gray-50 transition"
                            >
                                <span className="font-mono text-[13px] tracking-tight text-gray-700">
                                    {sticker.date
                                        ? format(new Date(sticker.date), 'd MMM yyyy', { locale: ru })
                                        : 'Выбрать дату'}
                                </span>
                                <Calendar className="w-3 h-3 text-gray-500" />
                            </button>

                            {showCalendar && (
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 right-full mr-2 z-50 scale-95 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
                                    onPointerDown={e => e.stopPropagation()}
                                >
                                    <DatePicker
                                        selected={sticker.date ? new Date(sticker.date) : null}
                                        onChange={date => {
                                            handleDateChange(date)
                                            setShowCalendar(false)
                                        }}
                                        inline
                                        locale={ru}
                                        calendarClassName="border-0 shadow-none"
                                    />
                                    <button
                                        onPointerDown={e => {
                                            e.stopPropagation()
                                            handleDateClear(e)
                                            setShowCalendar(false)
                                        }}
                                        className="dateCancel"
                                    >
                                        Убрать дедлайн
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="about text-sm font-medium text-gray-700 px-2">
                            Описание
                        </div>

                        <textarea
                            className="textPlace w-full min-h-[120px] box-border px-4 py-3 rounded-xl bg-gray-20 text-[15px] text-gray-800 resize-none outline-none placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-300 transition"
                            placeholder="Текст..."
                            spellCheck={false}
                            value={sticker.description || ''}
                            onChange={e => updateSticker(sticker.id, { description: e.target.value })}
                            onBlur={handleDescriptionBlur}
                        />
                    </div>
                </div>
            )}

            {selected && (
                <NodeResizer
                    minWidth={140}
                    minHeight={30}
                    onResizeEnd={async (_, params) => {
                        const w = Math.max(1, Math.round(params.width))
                        const h = Math.max(1, Math.round(params.height))

                        updateSticker(sticker.id, { width: w, height: h })
                        try {
                            await roadmapApi.updateSize(sticker.id, w, h)
                        } catch (err) {
                            console.warn('Не удалось сохранить размер roadmap', err)
                        }
                    }}
                />
            )}
        </div>
    )
}

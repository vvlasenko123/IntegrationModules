import React from 'react'
import { createRoot } from 'react-dom/client'
import { StickerBoardWidget } from '../widgets/StickerBoardWidget.jsx'
import '../libs/i18n' // инициализация i18n, если нужна

// Простой render для локальной проверки модуля.
const root = createRoot(document.getElementById('root'))
root.render(<StickerBoardWidget />)
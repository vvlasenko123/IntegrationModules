import React from 'react'
import { createRoot } from 'react-dom/client'
import { StickerBoardWidget } from '../features/stickerBoard/ui/StickerBoardWidget'
import '../libs/i18n' // инициализация i18n, если нужна

// Простой render для локальной проверки модуля.
const root = createRoot(document.getElementById('root'))
root.render(<StickerBoardWidget />)
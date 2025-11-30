import React from 'react'
import { createRoot } from 'react-dom/client'
import { StickerBoardWidget } from './features/stickerBoard/ui/StickerBoardWidget'
import './index.css'
import './libs/i18n'

createRoot(document.getElementById('root')).render(<StickerBoardWidget />)
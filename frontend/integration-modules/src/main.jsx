import React from 'react'
import { createRoot } from 'react-dom/client'
import { StickerBoardWidget } from './widgets/StickerBoardWidget.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(<StickerBoardWidget />)
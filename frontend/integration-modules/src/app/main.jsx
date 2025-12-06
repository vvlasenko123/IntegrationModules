import React from 'react'
import { createRoot } from 'react-dom/client'
import { StickerBoardWidget } from '../widgets/StickerBoardWidget.jsx'
import '../libs/i18n'

const root = createRoot(document.getElementById('root'))
root.render(<StickerBoardWidget />)
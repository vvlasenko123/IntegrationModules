import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RoadmapBoardWidget } from './widgets/RoadmapBoardWidget.jsx'
import { MarkdownBoardWidget} from "./widgets/MarkdownBoardWidget.jsx";
import {NoteBoardWidget } from './widgets/NoteBoardWidget.jsx'
import {EmojiBoardWidget } from './widgets/EmojiBoardWidget.jsx'
import {ShapeBoardWidget } from './widgets/ShapeBoardWidget.jsx'

import '@xyflow/react/dist/style.css';
const root = createRoot(document.getElementById('root'))
root.render(<RoadmapBoardWidget />)

root.render(<EmojiBoardWidget />)
root.render(<ShapeBoardWidget />)

root.render(< MarkdownBoardWidget/>)


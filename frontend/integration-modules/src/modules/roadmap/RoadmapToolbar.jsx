import React from 'react'
import '../../styles/stickerPalette.css'
import roadmapAdd from '../../assets/roadmap_add.svg'
import roadmapAddActive from '../../assets/roadmap_add_active.svg'

export const RoadmapToolbar = ({ onCreateClick }) => {
    const [active, setActive] = React.useState(false)

    const onClick = (e) => {
        e.stopPropagation()
        setActive(true)
        onCreateClick?.()
        requestAnimationFrame(() => setActive(false))
    }

    return (
        <div className="left-toolbar-container" onClick={e => e.stopPropagation()}>
            <div className="toolbar-card">
                <button
                    className={`toolbar-btn toolbar-btn--icon toolbar-btn--roadmap ${active ? 'toolbar-btn--active' : ''}`}
                    onClick={onClick}
                    title="Roadmap"
                >
                    <div className={`toolbar-markdown-plate ${active ? 'toolbar-markdown-plate--active' : ''}`}>
                        <img
                            src={active ? roadmapAddActive : roadmapAdd}
                            alt="Roadmap"
                            draggable={false}
                        />
                    </div>
                </button>
            </div>
        </div>
    )
}

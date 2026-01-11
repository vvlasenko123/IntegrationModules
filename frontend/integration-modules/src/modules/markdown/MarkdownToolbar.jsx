// modules/markdown/MarkdownToolbar.jsx
import React from 'react'
import '../../styles/stickerPalette.css'
import markdownAdd from '../../assets/markdown_add.svg'
import markdownAddActive from '../../assets/markdown_add_active.svg'

export const MarkdownToolbar = ({ onCreateClick }) => {
    const [active, setActive] = React.useState(false)

    const onClick = (e) => {
        e.stopPropagation()
        setActive(true)
        onCreateClick?.('')
        requestAnimationFrame(() => setActive(false))
    }

    return (
        <div className="left-toolbar-container" onClick={e => e.stopPropagation()}>
            <div className="toolbar-card">
                <button
                    className={`toolbar-btn toolbar-btn--icon toolbar-btn--markdown ${active ? 'toolbar-btn--active' : ''}`}
                    onClick={onClick}
                    title="Markdown Block"
                >
                    <div className={`toolbar-markdown-plate ${active ? 'toolbar-markdown-plate--active' : ''}`}>
                        <img
                            src={active ? markdownAddActive : markdownAdd}
                            alt="Markdown"
                            draggable={false}
                        />
                    </div>
                </button>
            </div>
        </div>
    )
}

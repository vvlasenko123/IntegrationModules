// components/sticker/resizeHandles.js

export const imageHandleStyles = {
    topLeft: { top: -6, left: -6, width: 12, height: 12 },
    topRight: { top: -6, right: -6, width: 12, height: 12 },
    bottomLeft: { bottom: -6, left: -6, width: 12, height: 12 },
    bottomRight: { bottom: -6, right: -6, width: 12, height: 12 }
}

export const imageHandleClasses = {
    topLeft: 'sticker-resize-handle',
    topRight: 'sticker-resize-handle',
    bottomLeft: 'sticker-resize-handle',
    bottomRight: 'sticker-resize-handle'
}

export const imageHandleComponent = {
    topLeft: <span className="sticker-resize-handle__dot" />,
    topRight: <span className="sticker-resize-handle__dot" />,
    bottomLeft: <span className="sticker-resize-handle__dot" />,
    bottomRight: <span className="sticker-resize-handle__dot" />
}
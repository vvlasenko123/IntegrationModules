import React from 'react'

// Простой mock Widget, который рендерит контент внутри контейнера.
// Экспортируем и named, и default чтобы покрыть оба варианта импорта.
export const Widget = ({ children, className, ...rest }) => {
    return (
        <div className={['xyflow-mock-widget', className].filter(Boolean).join(' ')} {...rest}>
            {children}
        </div>
    )
}

export default {
    Widget,
}
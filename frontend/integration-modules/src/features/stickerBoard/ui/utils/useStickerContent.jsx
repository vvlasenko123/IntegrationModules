import { useEffect, useState } from 'react'

export const useStickerContent = (sticker, isImage, setText) => {
    const [editing, setEditing] = useState(false)

    const onDoubleClick = (e) => {
        if (isImage) return

        e.stopPropagation()
        setEditing(true)

        setTimeout(() => {
            const el = e.currentTarget
            if (!el) return

            el.focus()

            const range = document.createRange()
            range.selectNodeContents(el)
            range.collapse(false)

            const sel = window.getSelection()
            sel.removeAllRanges()
            sel.addRange(range)
        }, 0)
    }

    const onInput = (e) => {
        if (isImage) return
        const text = e.currentTarget.innerText
        setText(sticker.id, text)
    }

    const onContentBlur = async (notesApi) => {
        setEditing(false)

        if (isImage) {
            return
        }

        try {
            await notesApi.updateContent(sticker.id, sticker.text || '')
        } catch (e) {
            console.warn('Не удалось сохранить текст заметки:', e)
        }
    }

    const setupContentEditable = (contentRef) => {
        useEffect(() => {
            if (isImage) return

            const el = contentRef.current
            if (!el) return

            if (document.activeElement !== el) {
                el.innerText = sticker.text || ''
            }

            el.style.direction = 'ltr'
            el.style.textAlign = 'left'

            try {
                el.spellcheck = false
            } catch (e) { }
        }, [sticker.id, isImage])

        useEffect(() => {
            if (isImage) return

            const el = contentRef.current
            if (!el) return

            const domText = el.innerText
            const stateText = sticker.text || ''

            if (domText !== stateText && document.activeElement !== el) {
                el.innerText = stateText
            }

            try {
                el.spellcheck = false
            } catch (e) { }
        }, [sticker.text, isImage])
    }

    const setupAutoFontSize = (contentRef) => {
        useEffect(() => {
            if (isImage) return

            const el = contentRef.current
            if (!el) return

            const MIN = 6
            const MAX = 18
            let fontSize = MAX

            el.style.fontSize = fontSize + 'px'

            const parent = el.parentElement
            if (!parent) return

            while (fontSize > MIN && (el.scrollHeight > parent.clientHeight || el.scrollWidth > parent.clientWidth)) {
                fontSize -= 1
                el.style.fontSize = fontSize + 'px'
            }
        }, [sticker.text, sticker.width, sticker.height, isImage])
    }

    return {
        editing,
        setEditing,
        onDoubleClick,
        onInput,
        onContentBlur,
        setupContentEditable,
        setupAutoFontSize
    }
}
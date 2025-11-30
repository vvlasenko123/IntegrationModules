async function parseError(res) {
    const text = await res.text()
    return text || `HTTP ${res.status}`
}

function normalizeStickerUrl(url) {
    if (!url) {
        return url
    }

    try {
        const u = new URL(url)

        if (u.hostname === 'minio') {
            u.hostname = window.location.hostname
            u.port = '9000'
        }

        return u.toString()
    } catch (e) {
        return url
    }
}

export const stickersApi = {
    async getAll() {
        const res = await fetch('/api/v1/stickers/get-all')
        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        const items = await res.json()
        if (!Array.isArray(items)) {
            return []
        }

        return items.map((x) => ({
            ...x,
            url: normalizeStickerUrl(x.url)
        }))
    },

    async addToBoard(stickerId) {
        const r = await fetch('/api/v1/stickers/board', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stickerId })
        })

        if (!r.ok) {
            throw new Error('Не удалось сохранить эмодзи на доске')
        }

        return await r.json()
    },

    async getBoard() {
        const r = await fetch('/api/v1/stickers/board')
        if (!r.ok) {
            throw new Error('Не удалось загрузить эмодзи с доски')
        }

        return await r.json()
    },

    async deleteSticker(id) {
        const r = await fetch(`/api/v1/stickers/${id}`, {
            method: 'DELETE'
        })

        if (!r.ok) {
            throw new Error(await parseError(r))
        }

        return true
    }
}

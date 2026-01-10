async function parseError(res) {
    const text = await res.text()
    return text || `HTTP ${res.status}`
}

export const stickersApi = {
    // справочник стикеров
    async getAll() {
        const res = await fetch('/api/v1/stickers/get-all')
        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        const items = await res.json()
        return Array.isArray(items) ? items : []
    },

    async getById(id) {
        const res = await fetch(`/api/v1/stickers/${id}`)
        if (!res.ok) {
            throw new Error(await parseError(res))
        }
        return await res.json()
    },

    // placement
    async addToBoard(stickerId, width = 80, height = 80) {
        const res = await fetch('/api/v1/stickers/board', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stickerId, width, height })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async getBoard() {
        const res = await fetch('/api/v1/stickers/board')
        if (!res.ok) {
            throw new Error('Не удалось загрузить стикеры с доски')
        }

        return await res.json()
    },

    async getBoardById(id) {
        const res = await fetch(`/api/v1/stickers/board/${id}`)
        if (!res.ok) {
            throw new Error(await parseError(res))
        }
        return await res.json()
    },

    async updateTransform(id, width, height) {
        const res = await fetch(`/api/v1/stickers/board/${id}/transform`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ width, height })
        })
        if (!res.ok) throw new Error(await res.text())
        return await res.json()
    },

    async removeFromBoard(id) {
        const res = await fetch(`/api/v1/stickers/${id}`, {
            method: 'DELETE'
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }
    }
}

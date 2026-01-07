async function parseError(res) {
    const text = await res.text()
    return text || `HTTP ${res.status}`
}

export const shapesApi = {
    async getAll() {
        const res = await fetch('/api/v1/shapes/get-all')
        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        const items = await res.json()
        if (!Array.isArray(items)) {
            return []
        }

        return items
    },

    async getById(id) {
        const res = await fetch(`/api/v1/shapes/${id}`)
        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async addToBoard(shapeId, width, height, rotation) {
        const res = await fetch('/api/v1/shapes/board', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shapeId, width, height, rotation })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async getBoard() {
        const res = await fetch('/api/v1/shapes/board')
        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        const items = await res.json()
        if (!Array.isArray(items)) {
            return []
        }

        return items
    },

    async getBoardById(id) {
        const res = await fetch(`/api/v1/shapes/board/${id}`)
        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async updateBoardTransform(id, width, height, rotation) {
        const res = await fetch(`/api/v1/shapes/board/${id}/transform`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ width, height, rotation })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },
    async delete(id) {
        const res = await fetch(`/api/v1/shapes/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error(await parseError(res))
        return true
    }

}

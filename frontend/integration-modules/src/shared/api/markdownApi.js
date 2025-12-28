async function parseError(res) {
    const text = await res.text()
    return text || `HTTP ${res.status}`
}

export const markdownApi = {
    async getAll() {
        const res = await fetch('/api/v1/markdown/get-all')
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
        const res = await fetch(`/api/v1/markdown/${id}`)
        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async create(content, width, height) {
        const res = await fetch('/api/v1/markdown/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, width, height })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async updateContent(id, content) {
        const res = await fetch(`/api/v1/markdown/${id}/content`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async updateSize(id, width, height) {
        const res = await fetch(`/api/v1/markdown/${id}/size`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ width, height })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async deleteById(id) {
        const res = await fetch(`/api/v1/markdown/${id}`, { method: 'DELETE' })
        if (!res.ok) {
            throw new Error(await parseError(res))
        }
    },

    async addToBoard(markdownId, width, height) {
        const res = await fetch('/api/v1/markdown/board', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ markdownId, width, height })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async getBoard() {
        const res = await fetch('/api/v1/markdown/board')
        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        const items = await res.json()
        if (!Array.isArray(items)) {
            return []
        }

        return items
    },

    async updateBoardSize(id, width, height) {
        const res = await fetch(`/api/v1/markdown/board/${id}/size`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ width, height })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async deleteBoard(id) {
        const res = await fetch(`/api/v1/markdown/board/${id}`, { method: 'DELETE' })
        if (!res.ok) {
            throw new Error(await parseError(res))
        }
    },

    async updateBoardEditorState(id, isEditorVisible) {
        const res = await fetch(`/api/v1/markdown/board/${id}/editor`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isEditorVisible })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    }
}

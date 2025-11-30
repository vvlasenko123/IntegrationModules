async function parseError(res) {
    const text = await res.text()
    return text || `HTTP ${res.status}`
}

export const notesApi = {
    async getAll() {
        const res = await fetch('/api/v1/note/get-all')
        if (!res.ok) {
            throw new Error(await parseError(res))
        }
        return await res.json()
    },

    async getById(id) {
        const res = await fetch(`/api/v1/note/${id}`)
        if (!res.ok) {
            throw new Error(await parseError(res))
        }
        return await res.json()
    },

    async create(color) {
        const res = await fetch('/api/v1/note/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: '', color })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async updateContent(id, content) {
        const res = await fetch(`/api/v1/note/${id}/content`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: content ?? '' })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    }
}

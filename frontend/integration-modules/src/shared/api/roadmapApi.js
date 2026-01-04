async function parseError(res) {
    const text = await res.text()
    return text || `HTTP ${res.status}`
}

export const roadmapApi = {
    async getAll() {
        const res = await fetch('/api/v1/roadmap/get-all')
        if (!res.ok) {
            throw new Error(await parseError(res))
        }
        return await res.json()
    },

    async getById(id) {
        const res = await fetch(`/api/v1/roadmap/${id}`)
        if (!res.ok) {
            throw new Error(await parseError(res))
        }
        return await res.json()
    },

    async create({ text, description, date, completed, cancelled, zIndex, width, height, parentId }) {
        const res = await fetch('/api/v1/roadmap/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: text ?? '',
                description: description ?? '',
                date: date ?? null,
                completed: completed ?? false,
                cancelled: cancelled ?? false,
                zIndex: zIndex ?? 0,
                width: width ?? 200,
                height: height ?? 120,
                parentId: parentId ?? null
            })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async updateText(id, text) {
        const res = await fetch(`/api/v1/roadmap/${id}/text`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text ?? '' })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async updateDescription(id, description) {
        const res = await fetch(`/api/v1/roadmap/${id}/description`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: description ?? '' })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async updateDate(id, date, completed) {
        const res = await fetch(`/api/v1/roadmap/${id}/date`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: date ?? null, completed: completed ?? false })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async updateCompleted(id, completed) {
        const res = await fetch(`/api/v1/roadmap/${id}/completed`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: completed ?? false })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async updateCancelled(id, cancelled) {
        const res = await fetch(`/api/v1/roadmap/${id}/cancelled`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cancelled: cancelled ?? false })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async updateZIndex(id, zIndex) {
        const res = await fetch(`/api/v1/roadmap/${id}/z-index`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ zIndex: zIndex ?? 0 })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async updateSize(id, width, height) {
        const res = await fetch(`/api/v1/roadmap/${id}/size`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ width, height })
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return await res.json()
    },

    async delete(id) {
        const res = await fetch(`/api/v1/roadmap/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) {
            throw new Error(await parseError(res))
        }

        return res.status === 204
    }
}

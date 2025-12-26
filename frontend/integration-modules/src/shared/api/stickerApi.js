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
        async removeFromBoard(placementId) {
            const res = await fetch(`/api/v1/stickers/board/${placementId}`, {
                method: 'DELETE',
                headers: { 'accept': '*/*' },
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text || 'Не удалось удалить стикер с доски')
            }

            return res.status === 204 ? null : await res.json()
        },
        async upload(file) {
            const formData = new FormData()
            formData.append('files', file)

            const res = await fetch('/api/v1/stickers/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                throw new Error(await parseError(res))
            }

            const contentType = res.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
                return await res.json()
            }

            return true
        },
    }

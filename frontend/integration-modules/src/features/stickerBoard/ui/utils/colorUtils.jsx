// utils/colorUtils.js

export function parseColorToRgb(input) {
    if (!input || typeof input !== 'string') return null
    const s = input.trim().toLowerCase()

    if (s[0] === '#') {
        const hex = s.slice(1)
        if (hex.length === 3) {
            const r = parseInt(hex[0] + hex[0], 16)
            const g = parseInt(hex[1] + hex[1], 16)
            const b = parseInt(hex[2] + hex[2], 16)
            return { r, g, b }
        } else if (hex.length === 6) {
            const r = parseInt(hex.slice(0, 2), 16)
            const g = parseInt(hex.slice(2, 4), 16)
            const b = parseInt(hex.slice(4, 6), 16)
            return { r, g, b }
        }
        return null
    }

    const rgbMatch = s.match(/rgba?\s*\(\s*([0-9]+)[\s,]+([0-9]+)[\s,]+([0-9]+)(?:[\s,\/]+\s*([0-9.]+))?\s*\)/)
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10)
        const g = parseInt(rgbMatch[2], 10)
        const b = parseInt(rgbMatch[3], 10)
        return { r, g, b }
    }

    const named = {
        white: { r: 255, g: 255, b: 255 },
        black: { r: 0, g: 0, b: 0 },
        red: { r: 255, g: 0, b: 0 },
        blue: { r: 0, g: 0, b: 255 },
        yellow: { r: 255, g: 255, b: 0 },
        green: { r: 0, g: 128, b: 0 }
    }
    if (named[s]) return named[s]

    return null
}

export function getContrastColorForBackground(bgColor) {
    const rgb = parseColorToRgb(bgColor)
    if (!rgb) {
        return '#0a0a0a'
    }
    const srgb = [rgb.r, rgb.g, rgb.b].map((v) => {
        const c = v / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
    return L > 0.6 ? '#0a0a0a' : '#ffffff'
}
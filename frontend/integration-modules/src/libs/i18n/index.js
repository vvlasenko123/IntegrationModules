// src/libs/i18n/index.js
import i18n from 'i18next'
import ru from './locales/ru/stickerBoard.json'

// Защищённая инициализация react-i18next:
// 1) динамически импортируем модуль react-i18next и логируем его экспорт,
// 2) пытаемся извлечь initReactI18next из возможных мест,
// 3) только если найден валидный плагин (функция или объект), вызываем i18n.use(plugin).

async function initI18n() {
    try {
        const mod = await import('react-i18next')
        console.info('[i18n] react-i18next module:', mod)

        // Возможные места, где может находиться плагин
        const candidate =
            mod?.initReactI18next ||
            (mod?.default && mod.default.initReactI18next) ||
            mod?.default ||
            null

        // Проверка: candidate должен быть функцией (middleware) или объектом-плагином
        const isValidPlugin =
            candidate &&
            (typeof candidate === 'function' || typeof candidate === 'object')

        if (!isValidPlugin) {
            console.warn('[i18n] initReactI18next not found or invalid. Skipping i18n plugin registration.', candidate)
        } else {
            i18n.use(candidate)
            console.info('[i18n] initReactI18next plugin applied.')
        }
    } catch (err) {
        console.error('[i18n] Failed to import react-i18next or initialize plugin:', err)
    }

    // Общая инициализация i18next (вне зависимости от плагина)
    i18n.init({
        lng: 'ru',
        fallbackLng: 'ru',
        ns: ['stickerBoard'],
        defaultNS: 'stickerBoard',
        resources: {
            ru: {
                stickerBoard: ru
            }
        },
        interpolation: {
            escapeValue: false
        }
    }).then(() => {
        console.info('[i18n] initialized')
    }).catch(err => {
        console.error('[i18n] init error:', err)
    })
}

initI18n()

export default i18n
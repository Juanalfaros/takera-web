import { defineField } from 'sanity'

/**
 * Idiomas soportados por la aplicación
 */
export const supportedLanguages = [
    { id: 'es', title: 'Español' },
    { id: 'en', title: 'English' },
]

export const defaultLanguage = 'es'

/**
 * Configuración centralizada para sanity-plugin-internationalized-array.
 * Úsalo en sanity.config.ts
 */
export const i18nConfig = {
    supportedLanguages,
    fieldTypes: ['string', 'text', 'array'], // Tipos base que el plugin convertirá a arrays internacionalizados
}

/**
 * Helper opcional para generar nombres descriptivos en el esquema (ej. 'name' -> 'name_i18n')
 * aunque el plugin genera tipos como 'internationalizedArrayString'
 */
export const getI18nType = (baseType: string = 'string') => {
    switch (baseType) {
        case 'string':
            return 'internationalizedArrayString'
        case 'text':
            return 'internationalizedArrayText'
        case 'array':
        case 'blockContent':
            return 'internationalizedArrayBlockContent'
        default:
            return `internationalizedArray${baseType.charAt(0).toUpperCase() + baseType.slice(1)}`
    }
}


/**
 * Opciones de idioma soportadas
 */
export const locales = ['es', 'en'] as const
export const defaultLocale = 'es'

export type Locale = (typeof locales)[number]

/**
 * Tipo devuelto por sanity-plugin-internationalized-array
 */
export interface InternationalizedString {
    _type: 'internationalizedArrayString' | 'internationalizedArrayText' | string
    _key: Locale
    value: string
}

/**
 * Extrae el valor localizado del array de Sanity acorde al idioma actual.
 * Si no encuentra el idioma solicitado, hace fallback a español 'es',
 * y si tampoco existe español, devuelve el primer valor disponible o un string vacío.
 * 
 * @param i18nArray Array devuelto por sanity-plugin-internationalized-array
 * @param currentLocale Idioma activo en Astro
 */
export function getLocalizedValue(
    i18nArray: InternationalizedString[] | undefined | null,
    currentLocale: string | undefined
): string {
    if (!i18nArray || !Array.isArray(i18nArray) || i18nArray.length === 0) return ''

    const targetLocale = (currentLocale || defaultLocale) as Locale

    // 1. Intentar el idioma actual exacto
    const exactMatch = i18nArray.find((item) => item._key === targetLocale)
    if (exactMatch && exactMatch.value) return exactMatch.value

    // 2. Fallback al idioma por defecto ('es')
    const fallbackMatch = i18nArray.find((item) => item._key === defaultLocale)
    if (fallbackMatch && fallbackMatch.value) return fallbackMatch.value

    // 3. Fallback al primer idioma disponible que tenga valor
    const firstAvailable = i18nArray.find((item) => item.value)
    if (firstAvailable) return firstAvailable.value

    return ''
}

/**
 * Mapeo de rutas traducidas entre español e inglés
 */
const ROUTE_MAP: Record<string, string> = {
    'catalogo': 'catalog',
    'catalog': 'catalogo',
    'contacto': 'contact',
    'contact': 'contacto',
    'gracias': 'thanks',
    'thanks': 'gracias'
}

/**
 * Devuelve la ruta localizada para un path y locale dado.
 */
export function localizePath(path: string, locale: string | undefined): string {
    const l = locale || defaultLocale
    let cleanPath = path.startsWith('/') ? path.slice(1) : path

    // Traducir el segmento de la ruta si existe en el mapa
    const segments = cleanPath.split('/')
    const translatedSegments = segments.map(seg => ROUTE_MAP[seg] || seg)

    // Para redirecciones o links internos, si el idioma es ES, 
    // intentamos usar la versión ES. Si es EN, la versión EN.
    // Pero ROUTE_MAP es bidireccional. Necesitamos saber la intención.

    // Simplificación: si l == 'en', buscamos la versión EN. Si l == 'es', la ES.
    // Vamos a refinar:
    const esRoutes = ['catalogo', 'contacto', 'gracias']
    const enRoutes = ['catalog', 'contact', 'thanks']

    const finalSegments = segments.map(seg => {
        if (l === 'en' && esRoutes.includes(seg)) return ROUTE_MAP[seg] || seg
        if (l === 'es' && enRoutes.includes(seg)) return ROUTE_MAP[seg] || seg
        return seg
    })

    const finalPath = '/' + finalSegments.join('/')

    if (l === defaultLocale) {
        return finalPath
    }

    return `/en${finalPath === '/' ? '' : finalPath}`
}

/**
 * Genera la URL para cambiar al idioma opuesto manteniendo el path actual.
 */
export function getToggleLocalePath(url: URL): string {
    const pathname = url.pathname
    const isEn = pathname === '/en' || pathname.startsWith('/en/')

    // Extraer el path relativo sin el prefijo de idioma
    let relativePath = isEn ? pathname.replace(/^\/en/, '') : pathname
    if (relativePath === '') relativePath = '/'

    // Traducir los segmentos del path para el idioma destino
    const segments = relativePath.split('/').filter(Boolean)
    const targetLocale = isEn ? 'es' : 'en'

    const translatedSegments = segments.map(seg => {
        // Solo traducimos si el segmento existe en nuestro mapa y corresponde al cambio
        return ROUTE_MAP[seg] || seg
    })

    const newRelativePath = '/' + translatedSegments.join('/')

    if (isEn) {
        // De Inglés a Español (quitar /en)
        return newRelativePath
    } else {
        // De Español a Inglés (poner /en)
        return `/en${newRelativePath === '/' ? '' : newRelativePath}`
    }
}

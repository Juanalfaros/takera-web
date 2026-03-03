/**
 * Tema personalizado de Sanity Studio con la identidad visual de Takera.
 * Usa la API oficial de Sanity v3: buildLegacyTheme
 * 
 * Tokens extraídos de apps/web/src/styles/global.css
 */
import { buildLegacyTheme } from 'sanity'

const props = {
    // ─── TAKERA BRAND TOKENS ───────────────────────────────────────────
    '--my-white': '#FFF9F0',   // Crema suave / masa (bg del sitio)
    '--my-black': '#1C1A1B',   // Negro carbón
    '--my-brand': '#E9762B',   // Naranja fuego (accent principal)
    '--my-green': '#9CB256',   // Verde oliva (success / positive)
    '--my-red': '#C0392B',   // Rojo error
    '--my-yellow': '#F5A623',   // Amarillo warning
}

export const takeraTheme = buildLegacyTheme({
    /* ─── Base ─────────────────────────────────────────────────────────── */
    '--black': props['--my-black'],
    '--white': props['--my-white'],

    /* ─── Grises (usando variantes del negro carbón) ───────────────────── */
    '--gray': '#888178',
    '--gray-base': '#888178',

    /* ─── Brand color ──────────────────────────────────────────────────── */
    '--brand-primary': props['--my-brand'],

    /* ─── Default body / fondo ─────────────────────────────────────────── */
    '--main-navigation-color': props['--my-black'],
    '--main-navigation-color--inverted': props['--my-white'],

    /* ─── Botones de acción ─────────────────────────────────────────────── */
    '--focus-color': props['--my-brand'],

    /* ─── Componentes: Input, Card, etc. ───────────────────────────────── */
    '--component-bg': props['--my-white'],

})

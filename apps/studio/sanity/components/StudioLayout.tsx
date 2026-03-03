import React, { useEffect, useMemo } from 'react'
import type { LayoutProps } from 'sanity'

export function StudioLayout(props: LayoutProps) {
  useEffect(() => {
    // 1. Inyectar Google Fonts (Solo una vez)
    if (!document.getElementById('takera-fonts')) {
      const link = document.createElement('link')
      link.id = 'takera-fonts'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Work+Sans:wght@300;400;600&display=swap'
      document.head.appendChild(link)
    }

    // 2. Inyectar CSS usando variables de Sanity (sin romper el editor)
    const styleId = 'takera-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
  :root {
    --wp-font-family-sans: 'Work Sans', system-ui, sans-serif;
    --wp-font-family-serif: 'Merriweather', Georgia, serif;
    --font-family-sans: var(--wp-font-family-sans);
    --font-family-serif: var(--wp-font-family-serif);
  }

  /* ✅ Apunta a la UI de Sanity, NO al interior del editor de contenido */
  [data-ui="Text"]:not([data-testid="portable-text-editor"] *), 
  [data-ui="TextInput"]:not([data-testid="portable-text-editor"] *),
  [data-ui="Label"]:not([data-testid="portable-text-editor"] *),
  [data-ui="Button"]:not([data-testid="portable-text-editor"] *) {
    font-family: var(--wp-font-family-sans) !important;
  }

  h1, h2, h3, h4, [data-ui="Heading"]:not([data-testid="portable-text-editor"] *) {
    font-family: var(--wp-font-family-serif) !important;
  }

  /* ✨ Solo aplica el naranja a botones primarios NEUTROS (sin tono específico) */
  [data-ui="Button"][data-tone="default"][data-variant="primary"],
  [data-ui="Button"]:not([data-tone]) [data-variant="primary"] {
    --card-bg-color: #E9762B;
    background-color: #E9762B;
    color: white;
  }
`
      document.head.appendChild(style)
    }
  }, [])

  return <>{props.renderDefault(props)}</>
}
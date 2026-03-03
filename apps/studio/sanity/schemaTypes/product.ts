import { defineType, defineField } from 'sanity'
import { getI18nType } from './i18nHelpers'
import { ProductLayout } from '../components/ProductLayout'

export const productType = defineType({
    name: 'product',
    title: 'Productos',
    type: 'document',
    groups: [
        { name: 'info', title: 'Información General' },
        { name: 'media', title: 'Media' },
        { name: 'inventory', title: 'Precios y Stock' },
        { name: 'technical', title: 'Ficha Técnica y Logística' },
    ],
    fields: [
        // --- GRUPO INFORMACION ---
        defineField({
            name: 'name',
            title: 'Nombre del Producto',
            type: getI18nType('string'),
            group: 'info',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            group: 'info',
            options: {
                source: (doc: any) => {
                    const esName = doc?.name?.find((n: any) => n._key === 'es')?.value
                    return esName || 'producto'
                },
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'sku',
            title: 'SKU',
            type: 'string',
            group: 'info',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Categoría',
            type: 'string',
            group: 'info',
            options: {
                list: [
                    { title: 'Tortillas de Harina / Flour', value: 'flour-tortillas' },
                    { title: 'Tortillas de Maíz / Corn', value: 'corn-tortillas' },
                    { title: 'Chips / Totopos', value: 'chips' },
                    { title: 'Insumos / Supplies', value: 'supplies' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'summary',
            title: 'Resumen Corto (Short Description)',
            type: getI18nType('blockContent'), // <-- CORREGIDO: antes decía 'array'
            group: 'info',
            description: 'Aparece justo debajo del título para enganchar al cliente.',
        }),
        defineField({
            name: 'description',
            title: 'Descripción Larga',
            type: getI18nType('blockContent'), // <-- CORREGIDO: antes decía 'array'
            group: 'info',
        }),
        defineField({
            name: 'badges',
            title: 'Etiquetas Destacadas (Badges)',
            type: 'array',
            group: 'info',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Takera', value: 'takera' },
                    { title: 'Best Seller', value: 'best-seller' },
                    { title: '100% Fresco', value: 'fresh' },
                    { title: 'Orgánico', value: 'organic' },
                    { title: 'Sin Gluten', value: 'gluten-free' },
                    { title: 'Food Service', value: 'food-service' },
                    { title: 'Horeca', value: 'horeca' },
                ],
            },
        }),

        // --- GRUPO PRECIOS Y STOCK ---
        defineField({
            name: 'price',
            title: 'Precio (USD)',
            type: 'number',
            group: 'inventory',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'salePresentation',
            title: 'Presentación de Venta',
            type: getI18nType('string'),
            group: 'inventory',
            description: 'ej: Paquete de 10 unidades / Pack of 10 units',
        }),
        defineField({
            name: 'status',
            title: 'Estado',
            type: 'string',
            group: 'inventory',
            initialValue: 'in-stock',
            options: {
                list: [
                    { title: 'En Stock', value: 'in-stock' },
                    { title: 'Agotado', value: 'out-of-stock' },
                    { title: 'Próximamente', value: 'coming-soon' },
                ],
            },
        }),

        // --- GRUPO MEDIA ---
        defineField({
            name: 'featuredImage',
            title: 'Imagen Destacada (Principal)',
            type: 'image',
            group: 'media',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'images',
            title: 'Galería de Imágenes',
            type: 'array',
            group: 'media',
            of: [
                {
                    type: 'image',
                    options: { hotspot: true },
                },
            ],
            options: {
                layout: 'grid',
            },
        }),

        // --- GRUPO TECNICO Y LOGISTICA ---
        defineField({
            name: 'specifications',
            title: 'Ficha Técnica (Specifications)',
            type: 'array',
            group: 'technical',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'key', title: 'Atributo', type: getI18nType('string') },
                        { name: 'value', title: 'Detalle', type: getI18nType('string') },
                    ],
                },
            ],
        }),
        defineField({
            name: 'logistics',
            title: 'Configuración de Envío (Logística)',
            type: 'object',
            group: 'technical',
            fields: [
                { name: 'billingUnit', title: 'Unidad de facturación', type: getI18nType('string') },
                { name: 'salesMultiple', title: 'Múltiplo de venta recomendado', type: 'number' },
                { name: 'dimensions', title: 'Dimensiones del paquete', type: 'string' },
            ],
        }),
    ],
})
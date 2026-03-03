import React, { useMemo, useCallback, useRef } from 'react'
import { Box, Card, Grid, Stack, Text } from '@sanity/ui'
import { type ObjectInputProps, type FieldMember, MemberField } from 'sanity'

const MAIN_FIELDS = ['name', 'slug', 'summary', 'description', 'featuredImage', 'images']
const SIDEBAR_FIELDS = ['status', 'price', 'salePresentation', 'sku', 'category', 'badges']
const TECHNICAL_FIELDS = ['specifications', 'logistics']

export function ProductLayout(props: ObjectInputProps) {
    const { members, renderField, renderInput, renderItem, renderPreview } = props

    // Estabilizar las funciones de render con refs
    const renderFieldRef = useRef(renderField)
    const renderInputRef = useRef(renderInput)
    const renderItemRef = useRef(renderItem)
    const renderPreviewRef = useRef(renderPreview)

    renderFieldRef.current = renderField
    renderInputRef.current = renderInput
    renderItemRef.current = renderItem
    renderPreviewRef.current = renderPreview

    const mainMembers = useMemo(
        () => members.filter((m): m is FieldMember => m.kind === 'field' && MAIN_FIELDS.includes(m.name)),
        [members]
    )
    const sidebarMembers = useMemo(
        () => members.filter((m): m is FieldMember => m.kind === 'field' && SIDEBAR_FIELDS.includes(m.name)),
        [members]
    )
    const technicalMembers = useMemo(
        () => members.filter((m): m is FieldMember => m.kind === 'field' && TECHNICAL_FIELDS.includes(m.name)),
        [members]
    )
    const otherMembers = useMemo(
        () => members.filter((m): m is FieldMember =>
            m.kind === 'field' &&
            !MAIN_FIELDS.includes(m.name) &&
            !SIDEBAR_FIELDS.includes(m.name) &&
            !TECHNICAL_FIELDS.includes(m.name)
        ),
        [members]
    )

    // useCallback con deps vacías — siempre usa la ref actualizada
    const renderMember = useCallback((member: FieldMember) => (
        <Box key={member.key}>
            <MemberField
                member={member}
                renderField={renderFieldRef.current}
                renderInput={renderInputRef.current}
                renderItem={renderItemRef.current}
                renderPreview={renderPreviewRef.current}
            />
        </Box>
    ), []) // ← deps vacías, las refs nunca cambian de identidad

    return (
        <Box style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
            <Grid columns={[1, 1, 1, 12]} gap={[4, 4, 5]}>

                <Box columnStart={1} columnEnd={[2, 2, 2, 9]}>
                    <Stack space={5}>
                        <Card padding={4} border radius={3} shadow={1}>
                            <Stack space={4}>
                                {mainMembers.map(renderMember)}
                            </Stack>
                        </Card>

                        {technicalMembers.length > 0 && (
                            <Card padding={4} border radius={3} shadow={1}>
                                <Text weight="bold" size={1} muted
                                    style={{ display: 'block', borderBottom: '1px solid currentColor', paddingBottom: '0.5rem', marginBottom: '1rem', opacity: 0.5, letterSpacing: '0.05em' }}
                                >
                                    ESPECIFICACIONES Y LOGÍSTICA
                                </Text>
                                <Stack space={4}>
                                    {technicalMembers.map(renderMember)}
                                </Stack>
                            </Card>
                        )}

                        {otherMembers.length > 0 && (
                            <Card padding={4} border radius={3} shadow={1}>
                                <Stack space={4}>
                                    {otherMembers.map(renderMember)}
                                </Stack>
                            </Card>
                        )}
                    </Stack>
                </Box>

                <Box columnStart={[1, 1, 1, 9]} columnEnd={[2, 2, 2, 13]}>
                    <div style={{ position: 'sticky', top: '2rem' }}>
                        <Stack space={4}>
                            <Card padding={4} border radius={3} shadow={1}>
                                <Text weight="bold" size={1} muted
                                    style={{ display: 'block', borderBottom: '1px solid currentColor', paddingBottom: '0.5rem', marginBottom: '1rem', opacity: 0.5, letterSpacing: '0.05em' }}
                                >
                                    VENTAS Y ORGANIZACIÓN
                                </Text>
                                <Stack space={4}>
                                    {sidebarMembers.map(renderMember)}
                                </Stack>
                            </Card>

                            <Card padding={3} tone="caution" radius={2} border shadow={1}>
                                <Text size={1} style={{ lineHeight: 1.6 }}>
                                    <b>Pro-Tip:</b> Un SKU único ayuda a rastrear mejor el inventario B2B. Los campos 🌐 se traducen al inglés automáticamente.
                                </Text>
                            </Card>
                        </Stack>
                    </div>
                </Box>
            </Grid>
        </Box>
    )
}
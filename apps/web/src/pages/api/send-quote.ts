import type { APIRoute } from 'astro'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

interface CartItem {
    id: string
    name: string
    slug: string
    price: number
    imageUrl: string | null
    quantity: number
    salePresentation?: string
}

interface QuotePayload {
    items: CartItem[]
    client: {
        name: string
        company: string
        email: string
        phone: string
        message?: string
    }
}

function buildItemRows(items: CartItem[]): string {
    return items
        .map(
            (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;">
            ${item.imageUrl
                    ? `<img src="${item.imageUrl}" width="60" height="60" style="object-fit:cover;border:1px solid #eee;" />`
                    : ''}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;">${item.name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#888;">${item.salePresentation || '—'}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;font-weight:700;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;color:#d97706;font-weight:700;">$${item.price.toFixed(2)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:700;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
        )
        .join('')
}

function buildTakerEmail(payload: QuotePayload): string {
    const total = payload.items.reduce((s, i) => s + i.price * i.quantity, 0)
    return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <div style="background:#111;padding:24px;text-align:center;">
        <h1 style="color:#d97706;margin:0;font-size:1.5rem;">NUEVA COTIZACIÓN</h1>
        <p style="color:#fff;margin:8px 0 0;font-size:0.9rem;">Takera Pro — Sistema Automático</p>
      </div>

      <div style="padding:24px;background:#f9f9f9;border-left:4px solid #d97706;">
        <h2 style="margin:0 0 12px;font-size:1rem;color:#d97706;">DATOS DEL CLIENTE</h2>
        <p style="margin:4px 0;"><strong>Nombre:</strong> ${payload.client.name}</p>
        <p style="margin:4px 0;"><strong>Empresa:</strong> ${payload.client.company || '—'}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> <a href="mailto:${payload.client.email}">${payload.client.email}</a></p>
        <p style="margin:4px 0;"><strong>Teléfono:</strong> ${payload.client.phone || '—'}</p>
        ${payload.client.message ? `<p style="margin:12px 0 0;"><strong>Mensaje:</strong><br>${payload.client.message}</p>` : ''}
      </div>

      <div style="padding:24px;">
        <h2 style="margin:0 0 16px;font-size:1rem;">PRODUCTOS SOLICITADOS</h2>
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
          <thead>
            <tr style="background:#111;color:#fff;">
              <th style="padding:8px 12px;text-align:left;"></th>
              <th style="padding:8px 12px;text-align:left;">Producto</th>
              <th style="padding:8px 12px;text-align:left;">Presentación</th>
              <th style="padding:8px 12px;text-align:center;">Cant.</th>
              <th style="padding:8px 12px;text-align:right;">P. Unit.</th>
              <th style="padding:8px 12px;text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${buildItemRows(payload.items)}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" style="padding:12px;text-align:right;font-weight:700;font-size:1rem;">ESTIMADO TOTAL</td>
              <td style="padding:12px;text-align:right;font-weight:700;font-size:1.2rem;color:#d97706;">$${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin:16px 0 0;font-size:0.8rem;color:#999;">* El precio final puede variar según volumen, presentación y condiciones de entrega.</p>
      </div>

      <div style="background:#111;padding:16px;text-align:center;font-size:0.8rem;color:#888;">
        Takera Pro · ventas@takera.us · +1 (305) 555-0199
      </div>
    </div>`
}

function buildClientEmail(payload: QuotePayload): string {
    const total = payload.items.reduce((s, i) => s + i.price * i.quantity, 0)
    return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <div style="background:#111;padding:24px;text-align:center;">
        <h1 style="color:#d97706;margin:0;font-size:1.5rem;">¡Cotización Recibida!</h1>
        <p style="color:#fff;margin:8px 0 0;font-size:0.9rem;">Takera Pro</p>
      </div>

      <div style="padding:24px;">
        <p>Hola <strong>${payload.client.name}</strong>,</p>
        <p>Hemos recibido tu solicitud de cotización. Nuestro equipo la revisará y te contactará en las próximas <strong>24 horas hábiles</strong>.</p>

        <h2 style="margin:24px 0 12px;font-size:1rem;">RESUMEN DE TU PEDIDO</h2>
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
          <thead>
            <tr style="background:#111;color:#fff;">
              <th style="padding:8px 12px;text-align:left;">Producto</th>
              <th style="padding:8px 12px;text-align:center;">Cant.</th>
              <th style="padding:8px 12px;text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${payload.items.map(item => `
            <tr>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;">${item.name}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:700;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>`).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px;text-align:right;font-weight:700;">ESTIMADO</td>
              <td style="padding:12px;text-align:right;font-weight:700;color:#d97706;font-size:1.1rem;">$${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin:16px 0 0;font-size:0.82rem;color:#999;">* El precio final puede variar. Te confirmaremos la cifra exacta.</p>

        <div style="margin:24px 0;padding:16px;background:#f9f9f9;border-left:4px solid #d97706;">
          <p style="margin:0;font-size:0.9rem;">¿Tienes preguntas urgentes? Escríbenos a <a href="mailto:ventas@takera.us">ventas@takera.us</a> o llámanos al +1 (305) 555-0199.</p>
        </div>
      </div>

      <div style="background:#111;padding:16px;text-align:center;font-size:0.8rem;color:#888;">
        Takera Pro · ventas@takera.us · +1 (305) 555-0199
      </div>
    </div>`
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const payload: QuotePayload = await request.json()

        if (!payload.items?.length || !payload.client?.email) {
            return new Response(JSON.stringify({ error: 'Datos incompletos' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const from = import.meta.env.RESEND_FROM || 'Takera <onboarding@resend.dev>'

        // Email a Takera
        await resend.emails.send({
            from,
            to: ['ventas@takera.us'],
            replyTo: payload.client.email,
            subject: `[Cotización] ${payload.client.name} — ${payload.items.length} producto(s)`,
            html: buildTakerEmail(payload),
        })

        // Email de confirmación al cliente
        await resend.emails.send({
            from,
            to: [payload.client.email],
            subject: 'Takera Pro — Cotización recibida ✓',
            html: buildClientEmail(payload),
        })

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (err) {
        console.error('[send-quote]', err)
        return new Response(JSON.stringify({ error: 'Error al enviar cotización' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}

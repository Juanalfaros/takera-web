import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function sendQuoteRequest(email: string, product: string) {
    const from = import.meta.env.RESEND_FROM || 'Takera <onboarding@resend.dev>';
    try {
        const data = await resend.emails.send({
            from,
            to: ['juanalfaro@takera.us'],
            subject: `Nueva Cotización: ${product}`,
            html: `<p>El cliente <strong>${email}</strong> quiere cotizar <strong>${product}</strong>.</p>`,
        });
        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
}
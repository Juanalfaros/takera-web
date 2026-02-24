import { Resend } from 'resend';

// Inicializar solo si hay API Key (para que no falle en build)
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function sendQuoteRequest(email: string, product: string) {
  try {
    const data = await resend.emails.send({
      from: 'Takera Web <onboarding@resend.dev>', // Cambiarás esto cuando verifiques dominio
      to: ['juanalfaro@takera.us'], // Tu correo real
      subject: `Nueva Cotización: ${product}`,
      html: `<p>El cliente ${email} quiere cotizar <strong>${product}</strong>.</p>`,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
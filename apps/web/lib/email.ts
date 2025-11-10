import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMagicLinkEmail(email: string, url: string) {
  console.log('Sending magic link email to:', email, 'with URL:', url);
  const response = await resend.emails.send({
    from: 'Postscript <noreply@postscript.ink>',
    to: email,
    subject: 'Sign in to Postscript',
    html: `
      <div style="font-family: sans-serif;">
        <h2>Sign in to Postscript</h2>
        <p>Click the button below to sign in:</p>
        <a href="${url}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Sign in</a>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
  console.log('Magic link email sent:', response);
}

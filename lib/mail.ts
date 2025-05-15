import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});

export async function sendResetMail(email: string, token: string) {
  await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: `Lohnsystem <mailgun@${process.env.MAILGUN_DOMAIN}>`,
    to: [email],
    subject: "Passwort zurücksetzen",
    text: `Setze dein Passwort zurück unter: ${process.env.APP_URL}/reset?token=${token}`,
  });
}

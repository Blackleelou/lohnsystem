import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

export async function sendTestMail() {
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: `postmaster@${process.env.MAILGUN_DOMAIN}`,
      to: 'jantzen.chris@gmail.com',
      subject: '✅ TS-Mailgun-Test erfolgreich!',
      text: 'Diese Mail wurde von deinem System erfolgreich versendet.',
    });

    console.log('✅ Mail verschickt:', result);
  } catch (err) {
    console.error('❌ Fehler beim Mailversand:', err);
  }
}

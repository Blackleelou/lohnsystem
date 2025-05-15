async function sendTestMail() {
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
      from: `postmaster@${process.env.MAILGUN_DOMAIN}`,
      to: 'jantzen.chris@gmail.com',
      subject: '✅ TS-Mailgun-Test erfolgreich!',
      text: 'Diese Mail wurde aus deinem Projekt verschickt. 🎯 Glückwunsch, Chris!',
    });

    console.log('✅ E-Mail gesendet:', result);
  } catch (error) {
    console.error('❌ Fehler beim Senden:', error);
  }
}

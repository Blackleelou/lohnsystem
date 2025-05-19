export async function sendResetMail(email: string, token: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const appUrl = process.env.APP_URL;

  if (!apiKey || !appUrl) {
    throw new Error("BREVO_API_KEY or APP_URL is missing");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: {
        name: "Lohnsystem",
        email: "noreply@meinlohn.app", // kann angepasst werden
      },
      to: [{ email }],
      subject: "Passwort zurücksetzen",
      htmlContent: `<p>Klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p><p><a href="${appUrl}/reset?token=${token}">${appUrl}/reset?token=${token}</a></p>`,
      textContent: `Setze dein Passwort zurück unter: ${appUrl}/reset?token=${token}`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Brevo-Fehler:", error);
    throw new Error(`Brevo API error: ${response.status}`);
  }
}

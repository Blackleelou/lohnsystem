// src/pages/legal.tsx

import Layout from "@/components/common/Layout";

export default function LegalPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-6 text-sm">
        <h1 className="text-2xl font-bold mb-6">Impressum & Datenschutz</h1>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-2">Angaben gemäß § 5 TMG</h2>
          <p>Chris Jantzen<br />
            Sandbergstraße 3<br />
            08112 Wilkau-Haßlau<br />
            Deutschland</p>
          <p className="mt-2">
            E-Mail: <a href="mailto:jantzen.chris@gmail.com" className="text-blue-600 underline">jantzen.chris@gmail.com</a><br />
            Telefon: 01520 6086949
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-2">Haftungsausschluss</h2>
          <p>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehme ich keine Haftung für die Inhalte externer Links.
            Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-2">Datenschutzerklärung</h2>
          <p>
            Diese Website speichert essenzielle Cookies, um grundlegende Funktionen bereitzustellen. Optional können Sie der Nutzung von Cookies
            für Statistik- und Marketingzwecke zustimmen. Diese Einwilligung können Sie jederzeit im Cookie-Banner widerrufen.
          </p>
          <p className="mt-2">
            Zur Reichweitenanalyse kann Google Analytics zum Einsatz kommen. Dies erfolgt nur nach Ihrer ausdrücklichen Zustimmung.
            Es gelten die Nutzungsbedingungen und Datenschutzbestimmungen von Google.
          </p>
          <p className="mt-2">
            Es erfolgt keine Weitergabe Ihrer personenbezogenen Daten an Dritte ohne Ihre ausdrückliche Zustimmung.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Hinweis gemäß § 19 UStG</h2>
          <p>
            Dieses Projekt wird aktuell als Hobbyprojekt betrieben. Es besteht keine Umsatzsteuerpflicht.
            Es handelt sich nicht um ein gewerbliches Angebot im rechtlichen Sinne.
          </p>
        </section>
      </div>
    </Layout>
  );
}

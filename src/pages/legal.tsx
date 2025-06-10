// src/pages/legal.tsx

import Layout from "@/components/common/Layout";

export default function LegalPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 px-6 text-sm leading-relaxed text-gray-800">
        <h1 className="text-3xl font-semibold mb-10">Impressum & Datenschutz</h1>

        <section className="mb-12">
          <h2 className="text-lg font-medium mb-2">Angaben gemäß § 5 TMG</h2>
          <address className="not-italic">
            Chris Jantzen<br />
            Sandbergstraße 3<br />
            08112 Wilkau-Haßlau<br />
            Deutschland
          </address>
          <p className="mt-2">
            E-Mail: <a href="mailto:jantzen.chris@gmail.com" className="text-blue-600 underline">jantzen.chris@gmail.com</a><br />
            Telefon: 01520&nbsp;6086949
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-medium mb-2">Haftung für Inhalte & Links</h2>
          <p>
            Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität kann jedoch keine Gewähr übernommen werden.
          </p>
          <p className="mt-2">
            Für externe Links zu Inhalten Dritter übernehmen wir keine Verantwortung. Für die Inhalte der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-medium mb-2">Datenschutzerklärung</h2>
          <p>
            Diese Website nutzt essenzielle Cookies, um grundlegende Funktionen bereitzustellen. Darüber hinaus können – nur mit Ihrer Zustimmung – Cookies für Statistik- und Marketingzwecke eingesetzt werden.
          </p>
          <p className="mt-2">
            Zur Reichweitenanalyse kann Google Analytics eingesetzt werden. Die Nutzung erfolgt ausschließlich nach Ihrer ausdrücklichen Einwilligung über das Cookie-Banner.
          </p>
          <p className="mt-2">
            Ihre personenbezogenen Daten werden niemals ohne Ihre Zustimmung an Dritte weitergegeben.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-medium mb-2">Hinweis gemäß § 19 UStG</h2>
          <p>
            Dieses Projekt wird derzeit als nicht-gewerbliches Hobbyprojekt betrieben. Es besteht keine Umsatzsteuerpflicht. Es handelt sich nicht um ein kommerzielles Angebot im rechtlichen Sinne.
          </p>
        </section>
      </div>
    </Layout>
  );
}

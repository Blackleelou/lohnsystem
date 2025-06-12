import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const QUESTIONS = [
  {
    q: 'Was bringt mir meinLohn?',
    a: 'Du behältst deine Schichten, Zuschläge und Abrechnungen immer im Blick. Du kannst nachrechnen, vergleichen und eventuelle Fehler frühzeitig entdecken – für mehr Fairness im Job.',
  },
  {
    q: 'Für wen ist meinLohn gedacht?',
    a: 'Für alle Arbeitnehmer:innen, Teams, Betriebsräte oder engagierte Kolleg:innen, die sich gemeinsam für korrekte Abrechnungen und transparente Lohnstrukturen einsetzen wollen.',
  },
  {
    q: 'Was kann ich als Betriebsrat oder Teamleiter tun?',
    a: 'Du kannst ein Team anlegen, Kollegen einladen, Einstellungen und Zuschläge für alle zentral pflegen und dabei helfen, den Aufwand für jeden Einzelnen zu reduzieren.',
  },
  {
    q: 'Ist meinLohn auch für Einzelpersonen geeignet?',
    a: 'Absolut! Du kannst das System auch komplett solo nutzen, deine eigenen Schichten verwalten und deine Abrechnung gegenchecken.',
  },
  {
    q: 'Was kostet das?',
    a: (
      <>
        Die Grundfunktionen von <strong>meinLohn</strong> sind dauerhaft kostenlos. Dieses Projekt wird als privates Herzensprojekt betrieben – komplett ohne Werbung, Abo-Modell oder versteckte Kosten.
        <br className="my-1" />
        Wenn du möchtest, kannst du die Entwicklung freiwillig unterstützen über{' '}
        <a
          href="https://coff.ee/meinLohn.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600 dark:text-blue-400"
        >
          Ko-fi
        </a>{' '}
        oder{' '}
        <a
          href="https://paypal.me/meinLohnapp"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600 dark:text-blue-400"
        >
          PayPal
        </a>
        .
      </>
    ),
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto my-10 px-2">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Häufige Fragen (FAQ)</h2>
      <ul className="space-y-2">
        {QUESTIONS.map((item, i) => (
          <li key={i} className="bg-white dark:bg-gray-900 rounded shadow p-4">
            <button
              className="flex items-center w-full text-left font-semibold text-gray-700 dark:text-gray-100"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              {item.q}
              <span className="ml-auto">{open === i ? <ChevronUp /> : <ChevronDown />}</span>
            </button>
            {open === i && (
              <div className="mt-2 text-gray-600 dark:text-gray-300 text-sm">{item.a}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

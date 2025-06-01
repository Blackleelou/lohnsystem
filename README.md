Lohnsystem – Brutto-/Netto-Auswertung mit Schichtplanung

Dieses Projekt ist ein webbasiertes Lohnsystem zur Verwaltung von Schichten, Bruttolohn-/Nettolohn-Auswertung und Abwesenheiten.
Es bietet eine moderne, mehrsprachige Oberfläche (Deutsch/Englisch), ein konfigurierbares Admin-Panel und volle Modularität für langfristige Erweiterbarkeit.

✨ Funktionen
🔐 Login & Registrierung mit Passwort-Reset

👤 Benutzerprofil inkl. Steuerklasse, Freibeträge, Kirchensteuer

🕒 Manuelle Überstundenverwaltung

💼 Adminbereich für Lohngruppen, Zuschläge und Feiertagskonfiguration

📅 Schichteinträge (Früh/Spät/Nacht), Abwesenheiten, Feiertagsberechnung

🌍 Mehrsprachig (Deutsch & Englisch)

📄 Exportfunktionen (PDF, Excel)

📱 Responsives Design – optimiert für Desktop und Mobilgeräte

🛡️ Datenschutzkonform (Admins haben keinen Zugriff auf persönliche Daten)


git clone https://github.com/Blackleelou/lohnsystem.git
cd lohnsystem
npm install
npm run dev
Die App läuft dann auf http://localhost:3000


🗂️ Verzeichnisstruktur (moderne Next.js Struktur)
/src
  /components        # Wiederverwendbare UI-Komponenten
    /admin           # Admin-spezifische UI
    /common          # Layout, ThemeSwitch, LanguageSwitcher, Banner, etc.
    /superadmin      # Superadmin-Komponenten
    /ui              # Generische UI-Bausteine (Buttons, Inputs, etc.)
    /user            # User-Menü, Profil, Avatar
  /lib               # Helper, Prisma, Auth, Theme-Utils
  /locales           # Sprachdateien (Frontend)
  /modules           # Funktionsmodule (z.B. board)
    /board           # Board-Komponenten, -Logik, -Types
  /pages             # Next.js Seiten und API-Endpunkte
    /admin           # Admin-Routen (z.B. /admin/board)
    /api             # API-Endpunkte (z.B. /api/admin/board)
    /superadmin      # Superadmin-Routen
  /styles            # Zentrale Stylesheets (globals.css etc.)
  /types             # Globale TypeScript-Typen
/prisma              # Datenbankschema und Migrations
/public              # Statische Dateien (Bilder, Flags, Lokalisierung)
.env                  # Lokale Umgebungsvariablen

🌍 Lokalisierung
Alle Sprachdateien liegen unter /src/locales/ und /public/locales/

Flaggen unter /public/flags/

🛡️ Admin-Policy & Datenschutz
Siehe Admin_Policy_Lohnsystem.md für die aktuelle Zugriffsmatrix und Datenschutzkonzept.

📄 Lizenz
MIT – frei verwendbar mit Quellenangabe.

Hinweis:
Die Struktur ist konsequent modular, alle großen Funktionsbereiche (z. B. board, company, payrules…) sind unter /src/modules/ gekapselt, UI-Komponenten nach Verantwortlichkeit und Wiederverwendbarkeit sortiert.


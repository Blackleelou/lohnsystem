# Lohnsystem – Brutto-/Netto-Auswertung mit Schichtplanung

Ein webbasiertes Lohnsystem zur Verwaltung von Schichten, Brutto-/Nettolohn-Auswertung und Abwesenheiten.  
Mit moderner Oberfläche, mehrsprachig (DE/EN), Admin-Panel, Benutzerprofil, und voller Modularität für einfache Erweiterbarkeit.

---

## ✨ Funktionen

- 🔐 Login & Registrierung mit Passwort-Reset
- 👤 Benutzerprofil (Steuerklasse, Freibeträge, Kirchensteuer, etc)
- 🕒 Manuelle Überstundenverwaltung
- 💼 Admin-Bereich für Lohngruppen, Zuschläge, Feiertagskonfiguration
- 📅 Schichteinträge (Früh/Spät/Nacht), Abwesenheiten, Feiertagsberechnung
- 🌍 Mehrsprachig (Deutsch & Englisch)
- 📄 Exportfunktionen (PDF, Excel)
- 📱 Responsive Design – Desktop & Mobile
- 🛡️ Datenschutzkonform (Admins ohne Zugriff auf persönliche Daten)

---

## 🚀 Projekt starten (lokal mit Next.js)

```bash
git clone https://github.com/Blackleelou/lohnsystem.git
cd lohnsystem
npm install
npm run dev

Die App läuft dann auf http://localhost:3000


🗂️ Verzeichnisstruktur
.
|-- .env
|-- .gitignore
|-- README.md
|-- package.json
|-- tsconfig.json
|-- tailwind.config.js
|-- postcss.config.js
|-- next-i18next.config.js
|-- i18n.ts
|-- middleware.ts
|-- verzeichnisbaum.txt
|-- prisma/
|   |-- schema.prisma
|   |-- seed.js
|   |-- migrations/
|       |-- migration_lock.toml
|       |-- 20250515075441_init/
|       |   |-- migration.sql
|       |-- 20250528012733_add_company_settings/
|       |   |-- migration.sql
|       |-- 20250531112439_remove_mode_field/
|           |-- migration.sql
|-- public/
|   |-- eye-closed.png
|   |-- eye-open.png
|   |-- flags/
|   |   |-- de.png
|   |   |-- gb.png
|   |-- locales/
|   |   |-- de.json
|   |   |-- en.json
|   |   |-- de/
|   |   |   |-- translation.json
|   |   |-- en/
|   |       |-- translation.json
|   |-- templates/
|       |-- resetPasswordMail.html
|-- src/
|   |-- components/
|   |   |-- admin/
|   |   |   |-- AdminPanel.tsx
|   |   |   |-- SuperPanel.tsx
|   |   |   |-- SuperpanelLayout.tsx
|   |   |   |-- ThemeSelector.tsx
|   |   |-- common/
|   |   |   |-- CookieBanner.tsx
|   |   |   |-- ErrorBoundary.tsx
|   |   |   |-- LanguageSwitcher.tsx
|   |   |   |-- Layout.tsx
|   |   |   |-- ThemeSwitch.tsx
|   |   |-- superadmin/
|   |   |   |-- CompanyAdmin.tsx
|   |   |   |-- SuperadminLayout.tsx
|   |   |-- ui/
|   |   |   |-- UploadButton.tsx
|   |   |-- user/
|   |       |-- PasswordReset.tsx
|   |       |-- UserMenu.tsx
|   |       |-- UserProfile.tsx
|   |-- lib/
|   |   |-- authOptions.ts
|   |   |-- authRequired.ts
|   |   |-- db.ts
|   |   |-- i18n.ts
|   |   |-- mail.ts
|   |   |-- prisma.ts
|   |   |-- themes.ts
|   |-- locales/
|   |   |-- de.json
|   |   |-- en.json
|   |-- modules/
|   |   |-- board/
|   |       |-- BoardPage.tsx
|   |       |-- constants.ts
|   |       |-- EntryCard.tsx
|   |       |-- EntryModal.tsx
|   |       |-- FilterPanel.tsx
|   |       |-- FormPanel.tsx
|   |       |-- Toast.tsx
|   |       |-- types.ts
|   |-- pages/
|   |   |-- auswertung.tsx
|   |   |-- dashboard.tsx
|   |   |-- debug-mode.tsx
|   |   |-- index.tsx
|   |   |-- login.tsx
|   |   |-- profile.tsx
|   |   |-- register.tsx
|   |   |-- reset-password.tsx
|   |   |-- reset-request.tsx
|   |   |-- settings.tsx
|   |   |-- superadmin.tsx
|   |   |-- verify.tsx
|   |   |-- _app.tsx
|   |   |-- _error.tsx
|   |   |-- README.txt
|   |   |-- admin/
|   |   |   |-- audit.tsx
|   |   |   |-- board.tsx
|   |   |   |-- index.tsx
|   |   |   |-- theme.tsx
|   |   |-- api/
|   |   |   |-- company.ts
|   |   |   |-- register.ts
|   |   |   |-- admin/
|   |   |   |   |-- audit.ts
|   |   |   |   |-- board.ts
|   |   |   |   |-- companies.ts
|   |   |   |   |-- payrules.ts
|   |   |   |   |-- shifts.ts
|   |   |   |   |-- superadminboardentrys.ts
|   |   |   |   |-- users.ts
|   |   |   |   |-- board/
|   |   |   |   |   |-- create.ts
|   |   |   |   |   |-- delete.ts
|   |   |   |   |   |-- import.ts
|   |   |   |   |   |-- update.ts
|   |   |   |   |-- companies/
|   |   |   |   |   |-- [id].ts
|   |   |   |   |-- payrules/
|   |   |   |   |   |-- [id].ts
|   |   |   |   |-- shifts/
|   |   |   |   |   |-- [id].ts
|   |   |   |   |-- superadminboardentrys/
|   |   |   |   |   |-- [id].ts
|   |   |   |   |-- user/
|   |   |   |   |   |-- [id].ts
|   |   |   |-- auth/
|   |   |   |   |-- status.ts
|   |   |   |   |-- [...nextauth].ts
|   |   |   |-- company/
|   |   |   |   |-- settings.ts
|   |   |   |-- debug/
|   |   |   |   |-- user.ts
|   |   |   |-- superadmin/
|   |   |   |   |-- companies.ts
|   |   |   |   |-- company/
|   |   |   |   |   |-- update.ts
|   |   |   |-- user/
|   |   |   |   |-- delete.ts
|   |   |   |   |-- login.ts
|   |   |   |   |-- reset-password.ts
|   |   |   |   |-- reset-request.ts
|   |   |   |   |-- send-code.ts
|   |   |   |   |-- test-email.ts
|   |   |   |   |-- update.ts
|   |   |   |   |-- verify-code.ts
|   |   |-- superadmin/
|   |   |   |-- companies.tsx
|   |   |   |-- index.tsx
|   |   |-- superpanel/
|   |       |-- index.tsx
|   |-- styles/
|   |   |-- globals.css
|   |   |-- password.css
|   |-- types/
|       |-- next-auth.d.ts

🌍 Lokalisierung
Sprachdateien:
src/locales/ und public/locales/

Flaggen:
public/flags/

🛡️ Admin-Policy & Datenschutz
Siehe Admin_Policy_Lohnsystem.md für Zugriffsmatrix & Datenschutzkonzept.

📄 Lizenz
MIT – frei verwendbar mit Quellenangabe.

Hinweis:
Die gesamte Struktur ist konsequent modular. Große Funktionsbereiche (wie Board) sind unter src/modules/ gekapselt, UI-Komponenten nach Verantwortlichkeit sortiert.
Das Projekt ist damit zukunftssicher, skalierbar und teamfähig!
```

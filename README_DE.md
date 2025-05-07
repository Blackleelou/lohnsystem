Lohnsystem - Schritt-fuer-Schritt-Anleitung (Render & lokal)

1. Lokale Nutzung:
------------------
- Stelle sicher, dass Python 3.x installiert ist.
- Entpacke das ZIP in einen Ordner.
- Oeffne ein Terminal oder eine Eingabeaufforderung.
- Wechsle in den Ordner und fuehre aus:
     pip install -r requirements.txt
     python app.py
- Oeffne http://localhost:5000 im Browser.

2. Nutzung mit Render.com (Webhosting):
--------------------------------------
- Erstelle ein kostenloses Konto unter https://render.com
- Erstelle ein neues GitHub-Repository und lade alle Dateien hoch.
- Gehe zu Render -> 'New Web Service' -> Verbinde dein GitHub-Konto.
- Waehle dein Repository aus und stelle ein:
    - Build Command: pip install -r requirements.txt
    - Start Command: gunicorn app:app
- Erstelle den Web Service -> fertig!

3. Zugangsdaten (Standard):
---------------------------
- Admin: admin@demo.de / Admin123!
- Testnutzer: test@demo.de / Test123!

4. Sprache umstellen & Einstellungen:
-------------------------------------
- Oben rechts kannst du Deutsch/Englisch wechseln.
- Benutzer koennen Steuerklasse, Kinderfreibetrag, Stunden usw. einstellen.
- Admin kann Lohngruppen, Wochenstunden und Zuschlaege verwalten.

Viel Erfolg beim Start!
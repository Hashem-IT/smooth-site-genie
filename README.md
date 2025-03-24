
# EasyDrop - Lieferplattform

Eine Plattform, die Unternehmen mit Fahrern für Lieferungen verbindet.

## Funktionen

- Benutzerauthentifizierung (Unternehmen und Fahrer)
- Bestellungsverwaltung
- Chat zwischen Unternehmen und Fahrern
- Echtzeit-Standortverfolgung
- Bild-Upload für Bestellungen

## Technische Details

- Frontend: React, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Supabase (Auth, PostgreSQL, Storage, Realtime-Funktionen)

## Einrichtung

1. Klonen Sie das Repository
2. Installieren Sie die Abhängigkeiten: `npm install`
3. Erstellen Sie ein Supabase-Projekt auf [supabase.com](https://supabase.com)
4. Kopieren Sie `.env.example` nach `.env` und aktualisieren Sie die Supabase-Anmeldedaten
5. Führen Sie die SQL-Skripte in der Datei `src/db/init.sql` im Supabase SQL-Editor aus
6. Starten Sie die Anwendung: `npm run dev`

## Supabase-Einrichtung

1. Erstellen Sie ein neues Projekt auf [supabase.com](https://supabase.com)
2. Gehen Sie zu Authentication > Settings und aktivieren Sie Email-Authentifizierung
3. Führen Sie die SQL-Skripte aus der Datei `src/db/init.sql` im SQL-Editor aus
4. Erstellen Sie einen Storage-Bucket namens "order-images"
5. Kopieren Sie die URL und den öffentlichen API-Schlüssel in Ihre `.env`-Datei

## Umgebungsvariablen

```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

# Automobilista 2 Serverkonfigurator
1. [Projektbeschreibung](#1-projektbeschreibung)
2. [Technologie](#2-technologie)
3. [Voraussetzungen](#3-voraussetzungen)
4. [Projektstruktur](#4-projektstruktur)
5. [Programmablauf](#programmablauf)
6. [API-Endpunkte](#5-api-endpunkte)
7. [Tests](#6-tests)

## 1. Projektbeschreibung
Diese Single Page Application (SPA) dient der Erstellung einer gültigen und lauffähigen Konfigurationsdatei (server.cfg) für einen Multiplayerserver der Renn-Simulation Automobilista 2. Es soll eine einfache Möglichkeit sein, einen Server für eine Session vorzukonfigurieren, ohne sich mit den Abhängigkeiten der Einstellungen oder den API-Werten selbst beschäftigen zu müssen.

### Funktionen
- Server-, Sitzungs-, Strecken-, Fahrzeug- und Regeleinstellungen bearbeiten
- Eingaben abhängig von den verfügbaren API-Daten anzeigen
- Abhängigkeiten zwischen Einstellungen automatisch synchronisieren, zum Beispiel Flags und Spielerzahlen
- Eine Vorschau der resultierenden Konfiguration anzeigen
- Die Konfiguration als `server.cfg` herunterladen

## 2. Technologie
Die folgenden Technologien werden im Projekt genutzt:
- React für die Oberfläche
- Vite für lokale Entwicklung und Frontend-Build
- Express für die Backend-API
- Node.js für Frontend- und Backend-Werkzeuge
- CSV- und JSON-Dateien als Datenquellen für Strecken, Fahrzeuge, Felddefinitionen und Optionen

## 3. Voraussetzungen
Um das Projekt zu bearbeiten, sind Node.js (22 oder neuer) und npm erforderlich. Zusätzlich kann Docker Desktop genutzt werden, um ein Dockerimage zu erstellen, welches Front und Backend gemeinsam nutzt.

### Installation

Installiere die Abhängigkeiten für Frontend und Backend getrennt.

Im Projektstamm:

    npm ci

Im Backend-Ordner:

    cd backend
    npm ci

### Lokale Entwicklung

Starte das Backend in einem Terminal:

    cd backend
    npm run dev

Das Backend läuft standardmäßig auf Port 3001.

Starte das Frontend in einem zweiten Terminal aus dem Projektstamm:

    npm run dev

Vite zeigt die lokale Frontend-Adresse im Terminal an. API-Aufrufe unter `/api` werden während der Entwicklung an `http://localhost:3001` weitergeleitet.

## 4. Projektstruktur

    src/
      components/       React-Komponenten der Oberfläche
      data/             Konfigurationsvorlage und Übersetzungen
      services/         Konfigurations-, Validierungs- und API-Logik
      App.jsx           Anwendungszustand und Zusammensetzen der Oberfläche

    backend/
      src/
        routes/         HTTP-Endpunkte
        services/       Laden und Filtern von Strecken und Fahrzeugen
        data/           API-Definitionen und CSV-Daten
        app.js          Express-App für Server und Tests
        server.js       Startet den HTTP-Server

## Programmablauf

1. Das Backend stellt Felddefinitionen, Optionen, Strecken und Fahrzeuge über die API bereit.
2. Das Frontend ordnet die Felddefinitionen den Eingabetypen und Tabs zu.
3. Änderungen an Eingaben werden im Konfigurationszustand verarbeitet. `configService.js` synchronisiert abhängige Werte und Flags.
4. `configTemplateService.js` setzt die Konfigurationswerte in `src/data/server.template.cfg` ein.
5. Die fertige `server.cfg` wird in der Vorschau angezeigt und kann heruntergeladen werden.

## 5. API-Endpunkte

| Methode | Pfad | Beschreibung |
|---|---|---|
| GET | `/api/health` | Statusprüfung des Backends |
| GET | `/api/options?source=enums.weather` | Optionen für eine bekannte Optionsquelle |
| GET | `/api/fields` | Session-Attribute und Session-Flags |
| GET | `/api/tracks` | Streckenliste |
| GET | `/api/tracks?search=monza` | Strecken nach Name, Variante oder DLC durchsuchen |
| GET | `/api/tracks?dlc=standard` | Nur Standardstrecken (`standard` oder `dlc`) |
| GET | `/api/VehicleModelId` | Fahrzeugliste |
| GET | `/api/VehicleModelId?search=gt3` | Fahrzeuge nach Name, Klasse oder DLC durchsuchen |
| GET | `/api/VehicleModelId?dlc=dlc` | Nur DLC-Fahrzeuge (`standard` oder `dlc`) |

Unbekannte Optionsquellen antworten mit HTTP 400.

Hinweis: Bisher ist keine Suchfunktion Bestandteil der Benutzeroberfläche.

## 6. Tests

### Frontend-Logiktests

Die Tests prüfen Konfigurationsänderungen, Validierung, Feldzuordnung
sowie Sichtbarkeits- und Sortierregeln. Sie benötigen keinen Browser.

Im Projektstamm ausführen:

    npm run test:logic

Coverage-Bericht mit Mindestwerten für Zeilen- und Branch-Abdeckung:

    npm run test:logic:coverage

### Backend-Tests

Die Backend-Tests prüfen Services und HTTP-Endpunkte.

Im Projektstamm:

    cd backend
    npm test

Coverage-Bericht:

    npm run test:coverage

### Weitere Qualitätsprüfungen

Frontend-Build erstellen:

    npm run build

Frontend-Lint ausführen:

    npm run lint

Hinweis: Die automatische Prüfung der erzeugten `server.cfg` ist noch nicht Teil der vorhandenen Testsuite.
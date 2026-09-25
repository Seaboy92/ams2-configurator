import templateText from '/src/data/server.template.cfg?raw'

// Standardwerte für den Server (Initialwerte)
export const defaultSettings = {
    name: 'Servername',
    secure: true,
    password: 'Passwort',
    maxPlayerCount: 16,

    allowEmptyJoin: true,
    controlGameSetup: true,
    sessionAttributes: {
        "ServerControlsTrack" : true,
        "TrackId" : 827815091,
        "GridSize" : 16,
        "MaxPlayers" : 16,
        "PracticeLength" : 10,
        "QualifyLength" : 10,
        "RaceLength" : 10,
        "DamageType" : 0,
        "PenaltiesType" : 0,
        "TireWearType" : 8,
        "FuelUsageType" : 2,
        "Flags" : 4194304
    },
}

// Funktion zum Formatieren der Werte
function formatValue(value, indent = 0) {
    const pad = ' '.repeat(indent)

    if (typeof value === 'string') {
        return JSON.stringify(value)
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value)
    }

    if (value === undefined || value === null) {
        return '""'
    }

    if (Array.isArray(value)) {
        if (value.length === 0) return '[]'

        return `[\n${value
        .map((item) => `${' '.repeat(indent + 4)}${formatValue(item, indent + 4)}`)
        .join(',\n')}\n${pad}]`
    }

    if (typeof value === 'object') {
        const entries = Object.entries(value)

        if (entries.length === 0) return '{}'

        return `{\n${entries
        .map(([key, item]) => `${' '.repeat(indent + 4)}"${key}" : ${formatValue(item, indent + 4)}`)
        .join(',\n')}\n${pad}}`
    }

    return String(value)
}

// Funktion zur Formatierung verschachtlter Werte
function formatObject(obj = {}) {
    return formatValue(obj, 0)
}

// Funktion zur Erstellung des Konfigurationsbereichs
function renderConfigSection(key, value, kind = 'simple') {
  
  if (value === undefined) {
    return ''
  }
  
  if (kind === 'object') {
    if (Object.keys(value).length === 0) {
      return ''
    }
    return `${key} : ${formatObject(value)}`
  }

  return `${key} : ${formatValue(value)}`
}

// Funktion zum befüllen des Templates 
function renderTemplate(template, bindings) {
    return template.replace(/^[ \t]*\{\{\s*([A-Za-z0-9_.]+)\s*\}\}[ \t]*\r?\n?/gm, (match, key) => {
            const binding = bindings[key]

            if (!binding) {
                return ''
            }
            const result = renderConfigSection(key, binding.value, binding.kind)

            // Wenn kein Wert vorhanden ist: komplette Zeile entfernen
            if (result === '') {
                return ''
            }
            // Wert vorhanden: Zeilenumbruch selbst wieder anhängen
            return `${result}\n`
        }
    )
}

// Funktion zur Erstellung der Konfigurationsdatei
// hier wird die Konfiguration erstellt
export function createServerConfigFromTemplate(config) {
    const serverName = typeof config.name === 'string' && config.name.trim() !== ''
        ? config.name
        : defaultSettings.name

    const configBindings = {
        logLevel: { kind: 'simple', value: config.logLevel},
        eventsLogSize: { kind: 'simple', value: config.eventsLogSize },
        // Ein leeres Eingabefeld darf den Standardnamen nicht überschreiben.
        name: { kind: 'simple', value: serverName },
        secure: { kind: 'simple', value: config.secure },
        password: { kind: 'simple', value: config.password },
        maxPlayerCount: { kind: 'simple', value: config.maxPlayerCount },
        bindIP: { kind: 'simple', value: config.bindIP },
        steamPort: { kind: 'simple', value: config.steamPort },
        hostPort: { kind: 'simple', value: config.hostPort },
        queryPort: { kind: 'simple', value: config.queryPort },
        sleepWaiting: { kind: 'simple', value: config.sleepWaiting },
        sleepActive: { kind: 'simple', value: config.sleepActive },
        sportsPlay: { kind: 'simple', value: config.sportsPlay },
        enableHttpApi: { kind: 'simple', value: config.enableHttpApi },
        httpApiLogLevel: { kind: 'simple', value: config.httpApiLogLevel },
        httpApiInterface: { kind: 'simple', value: config.httpApiInterface },
        httpApiPort: { kind: 'simple', value: config.httpApiPort },
        httpApiExtraHeaders: { kind: 'object', value: config.httpApiExtraHeaders ?? {}},
        httpApiAccessLevels: { kind: 'object', value: config.httpApiAccessLevels ?? {}},
        httpApiAccessFilters: { kind: 'object', value: config.httpApiAccessFilters ?? {}},
        httpApiUsers: { kind: 'object', value: config.httpApiUsers ?? {}},
        httpApiGroups: { kind: 'object', value: config.httpApiGroups ?? {}},
        staticWebFiles: { kind: 'simple', value: config.staticWebFiles},
        enableLuaApi: { kind: 'simple', value: config.enableLuaApi },
        allowEmptyJoin: { kind: 'simple', value: config.allowEmptyJoin },
        controlGameSetup: { kind: 'simple', value: config.controlGameSetup },
        sessionAttributes: { kind: 'object', value: config.sessionAttributes ?? {}},
    }
    return renderTemplate(templateText, configBindings)
}

// Gibt die Initiale Configuration zurück
export function getDefaultConfig() {
  return defaultSettings
}

export default {
  createServerConfigFromTemplate,
}
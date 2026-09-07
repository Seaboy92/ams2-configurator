import { sortConfigSection } from "./fieldDisplay"

const FILL_SESSION_WITH_AI = 131072

// Hilfsfunktionen
const hasUsableNumber = (value) =>
    value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value))

const setSessionFlag = (flags, flagValue, enabled) =>
    enabled ? flags | flagValue : flags & ~flagValue

// Abhängigkeit des KI-Flags von GridSize und MaxPlayers
const syncFillSessionWithAi = (sessionAttributes) => {
    const { GridSize, MaxPlayers } = sessionAttributes

    if (!hasUsableNumber(GridSize) || !hasUsableNumber(MaxPlayers)) {
        return
    }

    const flags = Number(sessionAttributes.Flags ?? 0)
    sessionAttributes.Flags = setSessionFlag(flags, FILL_SESSION_WITH_AI, Number(MaxPlayers) < Number(GridSize))
}

const PASSWORD_PROTECTED = 4194304
const syncPasswordProtected = (config) => {
    const password = String(config.server?.password ?? '').trim()
    const flags = Number(config.sessionAttributes?.Flags ?? 0)

    config.sessionAttributes.Flags = setSessionFlag(flags, PASSWORD_PROTECTED, password.length > 0)
}

// Datei zum Lesen und Ändern der Configuration
// Konfiguration laden
export const getConfigValue = (config, fieldOrName) => {
    const field = typeof fieldOrName === 'string' ? { name: fieldOrName } : fieldOrName
    // wenn das Feld ein Flag-Feld ist
    if (field.flagGroup === 'sessionFlags') {

        const flags = Number(
            config.sessionAttributes?.Flags ?? 0
        )

        return (flags & field.flagValue) !== 0
    }
    
    return Object.values(config)
        .map(section => section?.[field.name])
        .find(value => value !== undefined) ?? ''
}

const getDefaultWeatherValue = (optionsBySource) => {
  return optionsBySource['enums.weather']?.[0]?.value
}

//Konfiguration anpassen
export const updateConfigValue = (config, field, newValue, optionsBySource) => {
    const newConfig = { ...config }

    const section = field.section

    // Bereich existiert noch nicht
    if (!newConfig[section]) {
        newConfig[section] = {}
    }

    // Flag-Werte setzen
    if (field.flagGroup === 'sessionFlags') {

        const currentFlags = Number(
            newConfig[section].Flags ?? 0
        )
        const wasEnabled = (currentFlags & field.flagValue) !== 0

        newConfig[section] = {
            ...newConfig[section],
            Flags: setSessionFlag(currentFlags, field.flagValue, newValue === true)
        }

        // Wird FILL_SESSION_WITH_AI deaktiviert, dann MaxPlayers auf GridSize setzen
        if (field.name === 'FILL_SESSION_WITH_AI' && wasEnabled && newValue === false) {
            newConfig[section].MaxPlayers = newConfig[section].GridSize
        }

        if (field.name === 'PASSWORD_PROTECTED' && wasEnabled && newValue === false) {
            newConfig.server = {
                ...newConfig.server,
                password: ''
            }
        }

        return newConfig
    }

    // Wert setzen
    newConfig[section] = {
        ...newConfig[section],
        [field.name]: newValue
    }

    // Abhängige Werte synchron halten
    // GridSize und MaxPlayers
    if (field.name === 'maxPlayerCount') {
        if (!newConfig.sessionAttributes) {
            newConfig.sessionAttributes = {}
        }

        newConfig.sessionAttributes.GridSize = newValue
    }

    if (field.name === 'maxPlayerCount' || field.name === 'GridSize' || field.name === 'MaxPlayers') {
        syncFillSessionWithAi(newConfig.sessionAttributes)
    }

    // Passwort-Flag
    if (field.name === 'password') {
        newConfig.sessionAttributes = {
            ...newConfig.sessionAttributes
        }

        syncPasswordProtected(newConfig)
    }

    // Wetter-Slots bereinigen
    const match = field.name.match(
        /^(Practice|Qualify|Race)WeatherSlots$/
    )

    if (match) {
        const prefix = match[1]
        const slotCount = Number(newValue)

        const slotPattern = new RegExp(
            `^${prefix}WeatherSlot(\\d+)$`
        )

        Object.keys(newConfig[section]).forEach(key => {
            const slotMatch = key.match(slotPattern)

            if (slotMatch) {
                const slotNumber = Number(slotMatch[1])

                if (slotNumber > slotCount) {
                    delete newConfig[section][key]
                }
            }
        })

        // Benötigte Slots automatisch anlegen
        for (let i = 1; i <= slotCount; i++) {

            const slotName = `${prefix}WeatherSlot${i}`

            // Nur anlegen, wenn noch kein Wert existiert
            if (newConfig[section][slotName] === undefined) {
                newConfig[section][slotName] = getDefaultWeatherValue(optionsBySource)
            }
        }
    }

    // Training/ Qualify bereinigen
    if ((field.name === 'PracticeLength' || field.name === 'QualifyLength') && Number(newValue) === 0) {
        const prefix = field.name === 'PracticeLength' ? 'Practice' : 'Qualify'

        // Anzahl der Wetterslots entfernen
        delete newConfig[section][`${prefix}WeatherSlots`]

        // Alle Wetter-Slots entfernen
        const slotPattern = new RegExp(`^${prefix}WeatherSlot\\d+$`)

        Object.keys(newConfig[section]).forEach(key => {
            if (slotPattern.test(key)) {
                delete newConfig[section][key]
            }
        })

        // Wetter-Fortschritt entfernen
        delete newConfig[section][`${prefix}WeatherProgression`]

        // ggf. weitere abhängige Einstellungen hier entfernen
    }


    // HIER sortieren
    newConfig[section] = sortConfigSection(
        newConfig[section]
    )

    return newConfig
}

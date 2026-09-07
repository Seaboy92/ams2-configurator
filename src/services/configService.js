import { sortConfigSection } from "./fieldDisplay"

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

        if (newValue === true) {
            newConfig[section].Flags =
                currentFlags | field.flagValue
        } else {
            newConfig[section].Flags =
                currentFlags & ~field.flagValue
        }

        return newConfig
    }

    // Wert setzen
    newConfig[section] = {
        ...newConfig[section],
        [field.name]: newValue
    }

    // Abhängige Werte synchron halten
    if (field.name === 'maxPlayerCount') {
        if (!newConfig.sessionAttributes) {
            newConfig.sessionAttributes = {}
        }

        newConfig.sessionAttributes.GridSize = newValue
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
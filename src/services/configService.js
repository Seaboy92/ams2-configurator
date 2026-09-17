import { sortConfigSection } from "./fieldDisplay"

// Hilfsfunktionen
const hasUsableNumber = (value) =>
    value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value))

const setSessionFlag = (flags, flagValue, enabled) =>
    enabled ? flags | flagValue : flags & ~flagValue

// Abhängigkeit des KI-Flags von GridSize und MaxPlayers
const FILL_SESSION_WITH_AI = 131072
const syncFillSessionWithAi = (sessionAttributes) => {
    const { GridSize, MaxPlayers } = sessionAttributes

    if (!hasUsableNumber(GridSize) || !hasUsableNumber(MaxPlayers)) {
        return
    }

    const flags = Number(sessionAttributes.Flags ?? 0)
    sessionAttributes.Flags = setSessionFlag(flags, FILL_SESSION_WITH_AI, Number(MaxPlayers) < Number(GridSize))
}

// Abhängigkeit des Passwort-Flags zum Passwort
const PASSWORD_PROTECTED = 4194304
const syncPasswordProtected = (config) => {
    const password = String(config.server?.password ?? '').trim()
    const flags = Number(config.sessionAttributes?.Flags ?? 0)

    config.sessionAttributes.Flags = setSessionFlag(flags, PASSWORD_PROTECTED, password.length > 0)
}

// Abhängigkeit des Same-Vehicle-Class-Flag zur Vehicle-Class
const FORCE_SAME_VEHICLE_CLASS = 512
const syncForceSameVehicleClass = (config) => {
    const controlsClass = Number(config.sessionAttributes?.ServerControlsVehicleClass) !== 0
    const vehicleClassId = Number(config.sessionAttributes?.VehicleClassId)
    const flags = Number(config.sessionAttributes?.Flags ?? 0)
    const enableSameClass = controlsClass && hasUsableNumber(vehicleClassId)
    
    config.sessionAttributes.Flags = setSessionFlag(flags, FORCE_SAME_VEHICLE_CLASS, enableSameClass)
}

// Abhängigkleit des Identical-Vehicles-Flag zum Vehicle
const FORCE_IDENTICAL_VEHICLES = 2
const syncForceIdenticalVehicles = (config) => {
    const controlsVehicle = Number(config.sessionAttributes?.ServerControlsVehicle) !== 0
    const VehicleModelId = Number(config.sessionAttributes?.VehicleModelId)
    const flags = Number(config.sessionAttributes?.Flags ?? 0)
    const enableIdenticalVehicles = controlsVehicle && hasUsableNumber(VehicleModelId)

    config.sessionAttributes.Flags = setSessionFlag(flags, FORCE_IDENTICAL_VEHICLES, enableIdenticalVehicles)
}

// Abhängigkeit des Multi-Vehicle-Class-Flag zur Multi-Vehicle-Class
const FORCE_MULTI_VEHICLE_CLASS = 1024
const syncForceMultiVehicleClass = (config) => {
    const MultiClassSlots = Number(config.sessionAttributes?.MultiClassSlots)
    const flags = Number(config.sessionAttributes?.Flags ?? 0)

    config.sessionAttributes.Flags = setSessionFlag(flags, FORCE_MULTI_VEHICLE_CLASS, MultiClassSlots > 0)
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
    
    if (field.section) {
        return config[field.section]?.[field.name] ?? ''
    }

    return config[field.name] ?? ''
}

const getDefaultWeatherValue = (optionsBySource) => {
  return optionsBySource['enums.weather']?.[0]?.value
}

const getDefaultVehicleClassValue = (optionsBySource) => {
  return optionsBySource['vehicle_classes']?.[0]?.value
}

const getDefaultVehicleValue = (optionsBySource) => {
  return optionsBySource['vehicles']?.[0]?.id
}

const getDefaultTireWearValue = (optionsBySource) => {
    return optionsBySource['enums.tire_wear']
        ?.find(option => option.name === 'OFF')
        ?.value
}

export const getDefaultRules = (optionsBySource) => {
    return optionsBySource['enums.penalties']
        ?.find(option => option.name === 'NONE')
        ?.value
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
            delete newConfig[section].OpponentDifficulty
        }

        if (field.name === 'PASSWORD_PROTECTED' && wasEnabled && newValue === false) {
            newConfig.server = {
                ...newConfig.server,
                password: ''
            }
        }

        if (field.name === 'TIMED_RACE' && wasEnabled && newValue === false) {
            newConfig[section].RaceExtraLap = false
            delete newConfig[section].RaceExtraLap
        }
        return newConfig
    }

    // Wert setzen
    if (section) {
        newConfig[section] = {
            ...newConfig[section],
            [field.name]: newValue
        }
    } else {
        newConfig[field.name] = newValue
    }
    
    // Abhängige Werte synchron halten
    // GridSize und MaxPlayers und KI
    // Ändert GridSize und MaxPlayers wenn MaxPlayerCount verändert wird 
    if (field.name === 'maxPlayerCount') {
        const previousMaxPlayerCount = Number(config.maxPlayerCount)
        const nextMaxPlayerCount = Number(newValue)
        const currentMaxPlayers = Number(newConfig.sessionAttributes?.MaxPlayers ?? nextMaxPlayerCount)

        newConfig.sessionAttributes = {
            ...newConfig.sessionAttributes,
            GridSize: nextMaxPlayerCount,
        }

        if (nextMaxPlayerCount < previousMaxPlayerCount) {
            newConfig.sessionAttributes.MaxPlayers = Math.min(currentMaxPlayers, nextMaxPlayerCount)
        }

        if (nextMaxPlayerCount > previousMaxPlayerCount && newConfig.controlGameSetup !== true) {
            newConfig.sessionAttributes.MaxPlayers = nextMaxPlayerCount
        }
    }

    // Wenn GridSize oder MaxPlayers verändert wird, dann FILL_SESSION_WITH_AI synchronisieren
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
    
    // Schaden
    if (field.name === 'DamageType'){
        if (newValue === 0) {
            delete newConfig[section].DamageScale
        }
    }

    // Startart
    if (field.name === 'RaceRollingStart' && newValue === false){
        delete newConfig[section].RaceFormationLap
    }

    // FORCE_SAME_VEHICLE_CLASS-Flag
    if (field.name === 'ServerControlsVehicleClass') {
        // Wenn der neue Wert true ist, obwohl MultiClassSlots > 0 ist, dann ServerControlsVehicleClass auf false setzen
        if (newValue === true && Number(newConfig[section].MultiClassSlots) > 0) {
            newConfig[section].ServerControlsVehicleClass = false
            return newConfig
        }
        if(getConfigValue(config, 'ServerControlsVehicleClass') === true) {
            // Wenn der neue wert false ist, dann alle VehicleClassId-Felder entfernen
            // deaktivieren der Fahrzeugwahl
            newConfig[section].ServerControlsVehicle = false
            delete newConfig[section].VehicleModelId

            Object.keys(newConfig[section]).forEach(key => {
                if(key.match('VehicleClassId')) {
                    delete newConfig[section][key]
                }
            })
        }else {
            // Wenn der neue Wert true ist, dann das erste VehicleClassId-Feld anlegen
            // Nur anlegen, wenn noch kein Wert existiert
            if (newConfig[section]['VehicleClassId'] === undefined) {
                newConfig[section]['VehicleClassId'] = getDefaultVehicleClassValue(optionsBySource)
            }
        }

        newConfig.sessionAttributes = {
            ...newConfig.sessionAttributes
        }
        syncForceSameVehicleClass(newConfig)
        syncForceIdenticalVehicles(newConfig)
    }

    // FORCE_IDENTICAL_VEHICLES-Flag
    if (field.name === 'ServerControlsVehicle') {
        // Wenn der neue Wert true ist, obwohl MultiClassSlots > 0 ist, dann ServerControlsVehicle auf false setzen
        if (newValue === true && Number(newConfig[section].MultiClassSlots) > 0) {
            newConfig[section].ServerControlsVehicle = false
            return newConfig
        }

        if(getConfigValue(config, 'ServerControlsVehicle') === true) {
            // Wenn der neue Wert false ist, dann alle VehicleModelId-Felder entfernen
            // deaktivieren der Fahrzeug-Klassen-Wahl
            newConfig[section].ServerControlsVehicleClass = false
            delete newConfig[section].VehicleClassId
            
            Object.keys(newConfig[section]).forEach(key => {
                if(key.match('VehicleModelId')) {
                    delete newConfig[section][key]
                }
            })
        }else {
            // Wenn der neue Wert true ist, dann das erste VehicleModelId-Feld anlegen
            // Nur anlegen, wenn noch kein Wert existiert
            if (newConfig[section]['VehicleModelId'] === undefined) {
                newConfig[section]['VehicleModelId'] = getDefaultVehicleValue(optionsBySource)
            }
        }

        newConfig.sessionAttributes = {
            ...newConfig.sessionAttributes
        }
        syncForceSameVehicleClass(newConfig)
        syncForceIdenticalVehicles(newConfig)
    }

    // Multi-Vehicle-Class-Flag
    if (field.name === 'MultiClassSlots') {
        const slotCount = Number(newValue)
        const slotPattern = new RegExp(
            `MultiClassSlot(\\d+)$`
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
        newConfig.sessionAttributes = {
            ...newConfig.sessionAttributes
        }

        // Wenn MultiClassSlots > 0, dann ServerControlsVehicleClass und ServerControlsVehicle auf false setzen
        if (slotCount > 0) {
            newConfig[section].ServerControlsVehicleClass = false
            newConfig[section].ServerControlsVehicle = false

            delete newConfig[section].VehicleClassId
            delete newConfig[section].VehicleModelId
        }
        
        syncForceSameVehicleClass(newConfig)
        syncForceIdenticalVehicles(newConfig)
        syncForceMultiVehicleClass(newConfig)
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

    // Regeln entfernen, wenn deaktiviert
    if (field.name === 'PenaltiesType' && newValue === 0){
        delete newConfig[section].PitWhiteLinePenalty
        delete newConfig[section].DriveThroughPenalty
        delete newConfig[section].AllowedCutsBeforePenalty
        delete newConfig[section].PitSpeedLimit

        newConfig.sessionAttributes = {
            ...newConfig.sessionAttributes
        }
    }

    // ControlGameSetup - funktionsbedingte Abhängigkeiten entfernen, wenn deaktiviert
    if (field.name === 'controlGameSetup') {
        newConfig.sessionAttributes = {
            ...newConfig.sessionAttributes
        }
        if (newValue === true){
            newConfig.sessionAttributes.ServerControlsTrack = true
        }
        if (newValue === false) {
            const flags = Number(newConfig.sessionAttributes.Flags ?? 0)
            const fillSessionWithAi = (flags & FILL_SESSION_WITH_AI) !== 0
            const { GridSize, MaxPlayers } = newConfig.sessionAttributes

            // Ohne Serverkontrolle darf eine zuvor durch KI aufgefüllte
            // Sitzung keine abweichende Spielerzahl behalten.
            if (fillSessionWithAi && hasUsableNumber(GridSize) && hasUsableNumber(MaxPlayers) && Number(GridSize) !== Number(MaxPlayers)) {
                newConfig.sessionAttributes.MaxPlayers = GridSize
                delete newConfig.sessionAttributes.OpponentDifficulty
                syncFillSessionWithAi(newConfig.sessionAttributes)
            }

            delete newConfig.sessionAttributes.ServerControlsTrack
            delete newConfig.sessionAttributes.MultiClassSlots
            delete newConfig.sessionAttributes.MultiClassSlot1
            delete newConfig.sessionAttributes.MultiClassSlot2
            delete newConfig.sessionAttributes.MultiClassSlot3
            delete newConfig.sessionAttributes.ServerControlsVehicleClass
            delete newConfig.sessionAttributes.VehicleClassId
            delete newConfig.sessionAttributes.ServerControlsVehicle
            delete newConfig.sessionAttributes.VehicleModelId

        }
        syncForceSameVehicleClass(newConfig)
        syncForceIdenticalVehicles(newConfig)
        syncForceMultiVehicleClass(newConfig)
            
    }

    // HIER sortieren
    newConfig.sessionAttributes = sortConfigSection(newConfig.sessionAttributes)

    return newConfig
}

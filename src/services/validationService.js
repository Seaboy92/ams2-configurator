function toUiBoolean(fieldName, value) {
  if (!booleanLikeFields.has(fieldName)) {
    return value
  }

  return value === 1 || value === true
}

function toApiNumber(fieldName, value) {
  if (!booleanLikeFields.has(fieldName)) {
    return value
  }

  return value ? 1 : 0
}

export const validationMap = {
    name: { required: true },
    maxPlayerCount: {min:2, max: 32, integer: true},
    MaxPlayers: {min:2, max: (config) => config.server?.maxPlayerCount, integer: true},
    MultiClassSlots: {min:0, max: 3, integer: true},
    RaceScheduledFullCourseYellow: {min: 0, max: 4, integer: true},
    
    OpponentDifficulty: { min: 70, max: 120, integer: true },
    GridSize: { min: 1, max: 32, integer: true },
    PitSpeedLimit: { min: 40, max: 200, step: 5, integer: true },
    AllowedCutsBeforePenalty: { min: 0, max: 50, integer: true },
    MinimumOnlineStrength: { min: 100, max: 5000, integer: true },
    
    PracticeLength: { min: (config) => {
                        const qualifyLength =
                            Number(config.sessionAttributes?.QualifyLength ?? 0)
                        if (qualifyLength === 0) {
                            return 1
                        }
                        return 0
                    }, integer: true },
    
    PracticeDateProgression: { min: 1, max: 60, integer: true },
    PracticeDateHour: { min: 0, max: 23, integer: true },
    PracticeWeatherSlots: { min: 0, max: 4, integer: true },
    PracticeWeatherProgression: { min: 1, max: 60, integer: true },

    QualifyLength: { min: (config) => {
                        const practiceLength =
                            Number(config.sessionAttributes?.PracticeLength ?? 0)
                        if (practiceLength === 0) {
                            return 1
                        }
                        return 0
                    }, integer: true },

    QualifyProgression: { min: 1, max: 60, integer: true },
    QualifyDateHour: { min: 0, max: 23, integer: true },
    QualifyWeatherSlots: { min: 0, max: 4, integer: true },
    QualifyWeatherProgression: { min: 1, max: 60, integer: true },

    RaceLength: { min: 0, integer: true },
    RaceDateProgression: { min: 1, max: 60, integer: true },
    RaceDateHour: { min: 0, max: 23, integer: true },
    RaceWeatherSlots: { min: 0, max: 4, integer: true },
    RaceWeatherProgression: { min: 1, max: 60, integer: true },
    RaceMandatoryPitStopsMinTyres: { min: 0, max: 4, integer: true },

}

export const getValidationValue = (validation, property, config) => {
    const value = validation?.[property]

    if (typeof value === 'function') {
        return value(config)
    }

    return value
}

export function validateField(name, value, rules) {
    if (!rules) {
        return { valid: true }
    }
    if (rules.required && (value === '' || value === null || value === undefined || String(value).trim() === '')) {
        return {
            valid: false,
            message: 'Der Servername darf nicht leer sein.',
        }
    }
    if (value === '' || value === null || value === undefined) {
        return { valid: true }
    }

    const numberValue = Number(value)

    if (rules.integer && !Number.isInteger(numberValue)) {
        return {
        valid: false,
        message: 'Bitte eine ganze Zahl eingeben.',
        }
    }

    if (rules.min !== undefined && numberValue < rules.min) {
        return {
        valid: false,
        message: `Wert muss mindestens ${rules.min} sein.`,
        }
    }

    if (rules.max !== undefined && numberValue > rules.max) {
        return {
        valid: false,
        message: `Wert darf höchstens ${rules.max} sein.`,
        }
    }

    if (rules.step !== undefined && rules.min !== undefined) {
        const remainder = (numberValue - rules.min) % rules.step

        if (remainder !== 0) {
        return {
            valid: false,
            message: `Wert muss in Schritten von ${rules.step} sein.`,
        }
        }
    }

    return { valid: true }
}
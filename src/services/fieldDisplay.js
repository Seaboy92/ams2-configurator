////////////////////////////////////////////////////////////
// FieldDisplay.js
//
// Hier werden besondere Darstellungsregeln für Felder
// definiert.
//
// Felder, die hier NICHT aufgeführt sind, werden automatisch
// angezeigt.
//
// Mögliche Einstellungen:
//
// visible  → bestimmt, ob das Feld angezeigt wird
// order    → bestimmt die Reihenfolge
////////////////////////////////////////////////////////////
import { getConfigValue } from './configService'
import { fieldRequiresControlGameSetup } from './configFields'

/*Felder die angezeigt werden sollen, werden auskommentiert*/
const hiddenFields = [
    'ServerControlsSetup',
    //'ServerControlsTrack',
    //'ServerControlsVehicleClass',
    //'ServerControlsVehicle',
    'GridSize',
    'GridLayout',
    //'MaxPlayers',
    //'OpponentDifficulty',
    'Flags',
    'AutoAdvanceSession',
    //'DamageType',
    //'DamageScale',
    'DamageRandomFailures',
    //'TireWearType',
    //'FuelUsageType',
    //'PenaltiesType',
    //'PitWhiteLinePenalty',
    //'DriveThroughPenalty',
    //'AllowedCutsBeforePenalty',
    'PitSpeedLimit',
    'ManualPitStops',
    'ManualRollingStarts', 
    'AllowedViews',
    'FullCourseYellows',
    //'TrackId',
    //'VehicleClassId',
    //'MultiClassSlots',
    //'MultiClassSlot1',
    //'MultiClassSlot2',
    //'MultiClassSlot3',
    'MultiClassSlot4',
    'MultiClassSlot5',
    'MultiClassSlot6',
    'MultiClassSlot7',
    'MultiClassSlot8',
    'MultiClassSlot9',
    //'VehicleModelId',
    'MinimumOnlineRank',
    'MinimumOnlineStrength',
    //'PracticeLength',
    //'PracticeDateHour',
    'PracticeDateProgression',
    'PracticeWeatherProgression',
    //'PracticeWeatherSlots',
    //'PracticeWeatherSlot1',
    //'PracticeWeatherSlot2',
    //'PracticeWeatherSlot3',
    //'PracticeWeatherSlot4',
    'PracticeLiveTrackPreset',
    //'QualifyLength',
    //'QualifyDateHour',
    'QualifyDateProgression',
    'QualifyWeatherProgression',
    //'QualifyWeatherSlots',
    //'QualifyWeatherSlot1',
    //'QualifyWeatherSlot2',
    //'QualifyWeatherSlot3',
    //'QualifyWeatherSlot4',
    'QualifyLiveTrackPreset',
    'QualifyPrivateSession',
    //'RaceLength',
    //'RaceExtraLap',
    'RaceDateYear',
    'RaceDateMonth',
    'RaceDateDay',
    //'RaceDateHour',
    'RaceDateProgression',
    'RaceWeatherProgression',
    //'RaceWeatherSlots', 
    //'RaceWeatherSlot1',
    //'RaceWeatherSlot2',
    //'RaceWeatherSlot3',
    //'RaceWeatherSlot4',
    'RaceRollingStart',
    'RaceMandatoryPitStops',
    'RaceMandatoryPitStopsMinTyres',
    'RaceFormationLap',
    'RaceLiveTrackPreset',
    'RaceScheduledFullCourseYellow',
    'DisablePitstopRefuelling',
    //'name',
    //'password',
    //'secure',
    //'maxPlayerCount',
    'bindIP',
    'steamPort',
    'hostPort',
    'queryPort',
    'delay',
    'sportsPlay',
    'enableHttpApi',
    'httpApiLogLevel',
    'httpApiInterface',
    'httpApiPort',
    'httpApiExtraHeaders',
    'httpApiAccessLevels',
    'httpApiAccessFilters.public', 
    'httpApiAccessFilters.private',
    'httpApiAccessFilters.admin',
    'httpApiUsers',
    'httpApiGroups',
    'staticWebFiles',
    'enableLuaApi',
    //'allowEmptyJoin',
    //'controlGameSetup'
    'PASSWORD_PROTECTED',
    'FORCE_SAME_VEHICLE_CLASS',
    'FORCE_MULTI_VEHICLE_CLASS',
    'FORCE_IDENTICAL_VEHICLES',
]

// Definition der Feldpositionen - gilt für Konfigurations- und Anzeige-Bereich
const fieldDisplay = {
    // Tab Allgemein
    name: {
        order: 0,
    },
    password: {
        order: 1,
    },
    secure: {
        order: 2,
    },
    maxPlayerCount: {
        order: 3,
    },
    // Tab Rennwochenedne
    PracticeLength: {
        order: 20,
    },
    PracticeDateHour: {
        order: 21,
        
        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeLength')) >= 1
        }
    },
    QualifyLength: {
        order: 30,
    },
    QualifyDateHour: {
        order: 31,
        
        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyLength')) >= 1
        }
    },
    RaceLength: {
        order: 40,
    },
    RaceDateHour: {
        order: 41,
        
        visible: (config) => {
            return Number(getConfigValue(config, 'RaceLength')) >= 1
        }
    },
    TIMED_RACE: {
        order: 42,
    },
    RaceExtraLap: {
        order: 43,
        
        visible: (config) => {
            const TIMED_RACE_FLAG = 1048576
            return getConfigValue(config, {
                name: 'TIMED_RACE',
                flagGroup: 'sessionFlags',
                flagValue: TIMED_RACE_FLAG,
            })
        },
    },
    COOLDOWNLAP: {
        order: 44,
    },

    // Tab Sitzung
    GridSize: {
        order: 4,
    },
    MaxPlayers: {
        order: 5,
    },
    FILL_SESSION_WITH_AI: {
        order: 6,
    },
    OpponentDifficulty: {
        order: 7,

        visible: (config) => {
            return Number(getConfigValue(config, 'GridSize')) > Number(getConfigValue(config, 'MaxPlayers'))
        }
    },
    DamageType: {
        order: 50,
    },
    DamageScale: {
        order: 51,

        visible: (config) => {
            return Number(getConfigValue(config, 'DamageType')) >= 1
        },
    },

    // Tab Strecke und Wetter
    ServerControlsTrack: {
        order: 1,
        visible: () => {return false},
    },
    TrackId: {
        order: 2,
    },
    PracticeWeatherSlots: {
        order: 60,

        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeLength')) >= 1
        },
    },
    PracticeWeatherSlot1: {
        order: 61,

        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeWeatherSlots')) >= 1
        },
    },
    PracticeWeatherSlot2: {
        order: 62,

        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeWeatherSlots')) >= 2
        },
    },
    PracticeWeatherSlot3: {
        order: 63,

        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeWeatherSlots')) >= 3
        },
    },
    PracticeWeatherSlot4: {
        order: 64,

        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeWeatherSlots')) >= 4
        },
    },

    QualifyWeatherSlots: {
        order: 70,

        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyLength')) >= 1
        },
    },
    QualifyWeatherSlot1: {
        order: 71,

        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyWeatherSlots')) >= 1
        },
    },
    QualifyWeatherSlot2: {
        order: 72,

        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyWeatherSlots')) >= 2
        },
    },
    QualifyWeatherSlot3: {
        order: 73,

        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyWeatherSlots')) >= 3
        },
    },
    QualifyWeatherSlot4: {
        order: 74,

        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyWeatherSlots')) >= 4
        },
    },

    RaceWeatherSlots: {
        order: 80,

        visible: (config) => {
            return Number(getConfigValue(config, 'RaceLength')) >= 4
        },
    },

    RaceWeatherSlot1: {
        order: 81,

        visible: (config) => {
            return Number(getConfigValue(config, 'RaceWeatherSlots')) >= 1
        },
    },
    RaceWeatherSlot2: {
        order: 82,

        visible: (config) => {
            return Number(getConfigValue(config, 'RaceWeatherSlots')) >= 2
        },
    },
    RaceWeatherSlot3: {
        order: 83,

        visible: (config) => {
            return Number(getConfigValue(config, 'RaceWeatherSlots')) >= 3
        },
    },
    RaceWeatherSlot4: {
        order: 84,

        visible: (config) => {
            return Number(getConfigValue(config, 'RaceWeatherSlots')) >= 4
        },
    },

    // Fahrzeuge
    ServerControlsVehicleClass: {
        order: 90,

        disabled: (config) => {
            return (getConfigValue(config, 'ServerControlsVehicle') === true) || (getConfigValue(config, 'MultiClassSlots') >= 1)
        },
    },
    VehicleClassId: {
        order: 91,

        visible: (config) => {
            return getConfigValue(config, 'ServerControlsVehicleClass') === true
        },
    },
    ServerControlsVehicle: {
        order: 92,

        disabled: (config) => {
            return (getConfigValue(config, 'ServerControlsVehicleClass') === true) || (getConfigValue(config, 'MultiClassSlots') >= 1)
        },
    },
    VehicleModelId: {
        order: 93,

        visible: (config) => {
            return getConfigValue(config, 'ServerControlsVehicle') === true
        },
    },
    MultiClassSlots: {
        order: 94,

        disabled: (config) => {
            return (getConfigValue(config, 'ServerControlsVehicleClass') === true) || (getConfigValue(config, 'ServerControlsVehicle') === true)
        },
    },
    MultiClassSlot1: {
        order: 95,
        visible: (config) => {
            return Number(getConfigValue(config, 'MultiClassSlots')) >= 1
        },
    },
    MultiClassSlot2: {
        order: 96,
        visible: (config) => {
            return Number(getConfigValue(config, 'MultiClassSlots')) >= 2
        },
    },
    MultiClassSlot3: {
        order: 97,
        visible: (config) => {
            return Number(getConfigValue(config, 'MultiClassSlots')) >= 3
        },
    },

    // Regeln
    PenaltiesType: {
        order: 100,
    },
    PitWhiteLinePenalty: {
        order: 101,
        visible: (config) => {
            return Number(getConfigValue(config, 'PenaltiesType')) == 1
        }
    },
    DriveThroughPenalty: {
        order: 102,
        visible: (config) => {
            return Number(getConfigValue(config, 'PenaltiesType')) == 1
        }
    },
    AllowedCutsBeforePenalty: {
        order: 103,
        visible: (config) => {
            return Number(getConfigValue(config, 'PenaltiesType')) == 1
        }
    },
    PitSpeedLimit: {
        order: 104,
        visible: (config) => {
            return Number(getConfigValue(config, 'PenaltiesType')) == 1
        }
    },

    // httpAPI einstellungen 
    httpApiPort: {
        visible: (config) => {
            return getConfigValue(config, 'enableHttpApi === true')
        },
    },

    httpApiLogLevel: {
        visible: (config) => {
            return getConfigValue(config, 'enableHttpApi === true')
        },
    },

    httpApiInterface: {
        visible: (config) => {
            return getConfigValue(config, 'enableHttpApi === true')
        },
    },
    // Flags am ende der Kongfiguration
    Flags: {
        order: 9999,
    }
}


// ==========================================================
// Hilfsfunktionen
// ==========================================================


/**
 * Gibt zurück, ob ein Feld angezeigt werden soll.
 *
 * Wenn für das Feld keine Regel existiert,
 * wird es automatisch angezeigt.
 */
export function isFieldVisible(field, config) {

    const settings = fieldDisplay[field.name]
    // Feld ist grundsätzlich ausgeblendet
    if (hiddenFields.includes(field.name)) {
        return false
    }

    // Keine spezielle Regel vorhanden
    if (!settings?.visible) {
        return true
    }

    // Spezielle Sichtbarkeitsregel ausführen
    if (typeof settings.visible === 'function') {
        return settings.visible(config)
    }

    // true / false
    return settings.visible
}

/**
 * Prüft ob ein Feld deaktiviert ist.
 *
 * Wenn für das Feld keine Regel existiert,
 * wird es automatisch aktiviert.
 */
export function isFieldDisabled(field, config) {
    if (fieldRequiresControlGameSetup.has(field.name) && getConfigValue(config, 'controlGameSetup') !== true ) {
        return true
    }

    const settings = fieldDisplay[field.name]

    if (typeof settings?.disabled === 'function') {
        return settings.disabled(config)
    }

    return settings?.disabled === true
}

/**
 * Gibt die Reihenfolge eines Feldes zurück.
 *
 * Felder ohne spezielle Reihenfolge bekommen 999.
 * Dadurch werden sie nach den speziell sortierten Feldern
 * angezeigt.
 */
export function getFieldOrder(field) {

    return fieldDisplay[field.name]?.order ?? 999
}

export const sortConfigSection = (section) => {
  return Object.fromEntries(
    Object.entries(section).sort(([nameA], [nameB]) => {
      const orderA = getFieldOrder({ name: nameA })
      const orderB = getFieldOrder({ name: nameB })

      return orderA - orderB
    })
  )
}
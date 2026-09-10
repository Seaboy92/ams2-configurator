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
    //'PitSpeedLimit',
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


const fieldDisplay = {
    // Allgemeine Einstellungen
    name: {
        order: 0,
    },
    // Password-Flag
    PASSWORD_PROTECTED: {
        order: 1,
        disabled: (config) => {
            return String(getConfigValue(config, 'password')).trim().length === 0
        },
    },
    password: {
        order: 2,
    },
    secure: {
        order: 3,
    },
    maxPlayerCount: {
        order: 4,
    },

    // Strecke
    ServerControlsTrack: {
        order: 1,
    },
    TrackId: {
        order: 2,
    },

    // Spielerzahl
    GridSize: {
        order: 3,
    },
    MaxPlayers: {
        order: 4,
    },
    FILL_SESSION_WITH_AI: {
        order: 5,
    },
    OpponentDifficulty: {
        order: 6,

        visible: (config) => {
            return Number(getConfigValue(config, 'GridSize')) > Number(getConfigValue(config, 'MaxPlayers'))
        }
    },

    // Rennlänge
    PracticeLength: {
        order: 9,
    },
    PracticeDateHour: {
        order: 10,
        
        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeLength')) >= 1
        }
    },
    QualifyLength: {
        order: 19,
    },
    QualifyDateHour: {
        order: 20,
        
        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyLength')) >= 1
        }
    },
    RaceLength: {
        order: 29,
    },
    RaceDateHour: {
        order: 30,
        
        visible: (config) => {
            return Number(getConfigValue(config, 'RaceLength')) >= 1
        }
    },
    TIMED_RACE: {
        order: 31,
    },
    RaceExtraLap: {
        order: 32,
        
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
        order: 33,
    },
    DamageType: {
        order: 34,
    },
    DamageScale: {
        order: 35,

        visible: (config) => {
            return Number(getConfigValue(config, 'DamageType')) >= 1
        },
    },

    // Wetter
    PracticeWeatherSlots: {
        order: 10,

        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeLength')) >= 1
        },
    },

    PracticeWeatherSlot1: {
        order: 11,

        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeWeatherSlots')) >= 1
        },
    },

    PracticeWeatherSlot2: {
        order: 12,

        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeWeatherSlots')) >= 2
        },
    },

    PracticeWeatherSlot3: {
        order: 13,

        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeWeatherSlots')) >= 3
        },
    },

    PracticeWeatherSlot4: {
        order: 14,

        visible: (config) => {
            return Number(getConfigValue(config, 'PracticeWeatherSlots')) >= 4
        },
    },
    
    QualifyWeatherSlots: {
        order: 20,

        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyLength')) >= 1
        },
    },

    QualifyWeatherSlot1: {
        order: 21,

        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyWeatherSlots')) >= 1
        },
    },

    QualifyWeatherSlot2: {
        order: 22,

        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyWeatherSlots')) >= 2
        },
    },

    QualifyWeatherSlot3: {
        order: 23,

        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyWeatherSlots')) >= 3
        },
    },

    QualifyWeatherSlot4: {
        order: 24,

        visible: (config) => {
            return Number(getConfigValue(config, 'QualifyWeatherSlots')) >= 4
        },
    },

    RaceWeatherSlots: {
        order: 30,

        visible: (config) => {
            return Number(getConfigValue(config, 'RaceLength')) >= 4
        },
    },

    RaceWeatherSlot1: {
        order: 31,

        visible: (config) => {
            return Number(getConfigValue(config, 'RaceWeatherSlots')) >= 1
        },
    },

    RaceWeatherSlot2: {
        order: 32,

        visible: (config) => {
            return Number(getConfigValue(config, 'RaceWeatherSlots')) >= 2
        },
    },

    RaceWeatherSlot3: {
        order: 33,

        visible: (config) => {
            return Number(getConfigValue(config, 'RaceWeatherSlots')) >= 3
        },
    },

    RaceWeatherSlot4: {
        order: 34,

        visible: (config) => {
            return Number(getConfigValue(config, 'RaceWeatherSlots')) >= 4
        },
    },

    // Fahrzeuge
    ServerControlsVehicleClass: {
        order: 40,

        disabled: (config) => {
            return (getConfigValue(config, 'ServerControlsVehicle') === true) || (getConfigValue(config, 'MultiClassSlots') >= 1)
        },
    },
    VehicleClassId: {
        order: 41,

        visible: (config) => {
            return getConfigValue(config, 'ServerControlsVehicleClass') === true
        },
    },
    ServerControlsVehicle: {
        order: 42,

        disabled: (config) => {
            return (getConfigValue(config, 'ServerControlsVehicleClass') === true) || (getConfigValue(config, 'MultiClassSlots') >= 1)
        },
    },
    VehicleModelId: {
        order: 43,

        visible: (config) => {
            return getConfigValue(config, 'ServerControlsVehicle') === true
        },
    },
    MultiClassSlots: {
        order: 44,

        disabled: (config) => {
            return (getConfigValue(config, 'ServerControlsVehicleClass') === true) || (getConfigValue(config, 'ServerControlsVehicle') === true)
        },
    },
    MultiClassSlot1: {
        order: 45,
        visible: (config) => {
            return Number(getConfigValue(config, 'MultiClassSlots')) >= 1
        },
    },
    MultiClassSlot2: {
        order: 46,
        visible: (config) => {
            return Number(getConfigValue(config, 'MultiClassSlots')) >= 2
        },
    },
    MultiClassSlot3: {
        order: 47,
        visible: (config) => {
            return Number(getConfigValue(config, 'MultiClassSlots')) >= 3
        },
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
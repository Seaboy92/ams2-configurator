import { tabRegistry, fieldTabOverrides, booleanLikeFields, customFields, enumLikeFields } from './configFields.js'
import { validationMap } from './validationService.js'

// Angabe der API-Sektionen, welche die konfigurierbaren Objekte beinhalten
const editableObjectKeys = new Set([
    'attributes/session',
])

// Funktion welche anhand des Datentyps die Eingabetyp wählt
export function mapTypeToInput(field) {
  const fieldName = field?.name ?? ''
  const isBooleanField = booleanLikeFields.has(fieldName)
  const isEnumField = enumLikeFields.has(fieldName)

  if (isBooleanField) {
    return 'checkbox'
  }

  if (isEnumField) {
    return 'select'
  }

  if (['int8', 'int16', 'int32', 'int64', 'float'].includes(field?.type)) {
    return 'number'
  }

  if (field?.type === 'textbox') {
    return 'textbox'
  }
  return 'text'
}

// Funktion zur Zuordnung von Enumtyp zum Feld
export function mapEnumToType(field, inputType) {
  // Wenn das Feld kein Select-Feld ist abbrechen 
  if (inputType !== 'select') return
  
  // Prüfen welches Feld es ist
  if (field.name.includes("Weather")) {
    return 'enums.weather'
  }
  if (field.name.includes("Penalties")) {
    return 'enums.penalties'
  }
  if (field.name.includes("FuelUsageType")) {
    return 'enums.fuel_usage'
  }
  if (field.name === "DamageScale") {
    return 'enums.damage_scale'
  }
  if (field.name.includes("Damage")) {
    return 'enums.damage'
  }
  if (field.name.includes("Track")) {
    return 'tracks'
  }
  if (field.name.includes("VehicleClassId") || field.name.includes("MultiClassSlot")) {
    return 'vehicle_classes'
  }
  if (field.name.includes("VehicleModelId")) {
    return 'vehicles'
  }
  if (field.name.includes("TireWearType")) {
    return 'enums.tire_wear'
  }
}

// Funktion welche die Zuordnung der Felder zu den Tabs ausführt
function getTabForObject(objectKey) {
  for (const [tabId, config] of Object.entries(tabRegistry)) {
      if (config.objects.includes(objectKey)) {
        return tabId
      }
  }

  return 'general'
}

// Funktion, welche die Flag-Felder aus der API erstellt
function getFlagFields(apiIds = {}) {
    const flagFields = []

    const flagData = apiIds['flags/session']

    if (!flagData || !Array.isArray(flagData.list)) {
        return flagFields
    }

    flagData.list.forEach(flag => {
        flagFields.push({
            name: flag.name,

            inputType: 'checkbox',

            flagValue: flag.value,
            flagGroup: 'sessionFlags',

            tab: fieldTabOverrides[flag.name] ?? 'session',
            translationKey: `flags.session.${flag.name}`,

            section: 'sessionAttributes',

            access: 'ReadWrite'
        })
    })

    return flagFields
}

// Funktion, welche die Konfiegurationsfelder aus der API erstellt
function getApiFields(apiIds = {}){
  
  const apiFields = []
  // Sammle informationen zu den Feldern aus der API
  Object.entries(apiIds).forEach(([objectKey, objectData]) => {
    // Wenn nicht in 'attributes/session' enthalten ist, überspringe dieses Feld.
    if (!editableObjectKeys.has(objectKey)) return
    // Wenn es leer ist, überspringe dieses Feld.
    if (!objectData || !Array.isArray(objectData.list)) return
    // Liste jedes gefundene Element auf 
    objectData.list.forEach((field, index) => {
      // Wenn Feld nicht existiert oder kein Objekt ist, überspringe dieses Feld.
      if (!field || typeof field !== 'object') return
      // Wenn das Feld ReadOnly ist, überspringe dieses Feld.
      if (field.access === 'ReadOnly') return
      
      // Tab-zuordnung
      const tabId = fieldTabOverrides[field.name] ?? getTabForObject(objectKey)
      // Übersetzungsschlüssel (wird bei erweitert mit .label oder .description)
      const translationKey = `attributes.session.${field.name}`

      const inputType = mapTypeToInput(field)
      
      apiFields.push({
        // das bisherige Array
        ...field,

        name: field.name,

        // wählt den inputtypen anhand des Datentypen
        inputType: inputType,
        
        // Zuordnung der Enums für Selectfelder
        optionsSource: mapEnumToType(field, inputType),

        tab: tabId,
        translationKey: translationKey,
        access: field.access,
        // prüft ob ein Eintrag mit Validierungsdefinition existiert
        validation: validationMap[field.name] ?? null,
        section: 'sessionAttributes',
      })
    })
  })
  return apiFields
}

// Funktion,welche alle Felder gesammelt zurück gibt 
export function createAllFields(apiIds = {}) {
  return [
    ...getApiFields(apiIds),
    ...getFlagFields(apiIds),
    ...(customFields ?? []),
  ]
}
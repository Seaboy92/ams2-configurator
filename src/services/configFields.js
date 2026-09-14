import { validationMap } from './validationService'
// Felder welche nicht in der Api enthalten sind
export const customFields = [
  {
    name: 'name',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.name',
    access: 'ReadWrite',
    validation: validationMap['name'],
  },
  {
    name: 'password',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.password',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'secure',
    inputType: 'checkbox',
    tab: 'general',
    translationKey: 'cfg.secure',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'maxPlayerCount',
    inputType: 'number',
    tab: 'general',
    translationKey: 'cfg.maxPlayerCount',
    access: 'ReadWrite',
    validation: validationMap['maxPlayerCount'],
  },
  {
    name: 'bindIP',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.bindIP',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'steamPort',
    inputType: 'number',
    tab: 'general',
    translationKey: 'cfg.steamPort',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'hostPort',
    inputType: 'number',
    tab: 'general',
    translationKey: 'cfg.hostPort',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'queryPort',
    inputType: 'number',
    tab: 'general',
    translationKey: 'cfg.queryPort',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'delay',
    inputType: 'number',
    tab: 'general',
    translationKey: 'cfg.delay',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'sportsPlay',
    inputType: 'number',
    tab: 'general',
    translationKey: 'cfg.sportsPlay',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'enableHttpApi',
    inputType: 'checkbox',
    tab: 'general',
    translationKey: 'cfg.enableHttpApi',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'httpApiLogLevel',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.httpApiLogLevel',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'httpApiInterface',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.httpApiInterface',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'httpApiPort',
    inputType: 'number',
    tab: 'general',
    translationKey: 'cfg.httpApiPort',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'httpApiExtraHeaders',
    inputType: 'textbox',
    tab: 'general',
    translationKey: 'cfg.httpApiExtraHeaders',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'httpApiAccessLevels',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.httpApiAccessLevels',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'httpApiAccessFilters.public',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.httpApiAccessFilters.public',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'httpApiAccessFilters.private',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.httpApiAccessFilters.private',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'httpApiAccessFilters.admin',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.httpApiAccessFilters.admin',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'httpApiUsers',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.httpApiUsers',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'httpApiGroups',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.httpApiGroups',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'staticWebFiles',
    inputType: 'text',
    tab: 'general',
    translationKey: 'cfg.staticWebFiles',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'enableLuaApi',
    inputType: 'checkbox',
    tab: 'general',
    translationKey: 'cfg.enableLuaApi',
    access: 'ReadOnly',
    validation: null,
  },
  {
    name: 'allowEmptyJoin',
    inputType: 'checkbox',
    tab: 'general',
    translationKey: 'cfg.allowEmptyJoin',
    access: 'ReadWrite',
    validation: null,
  },
  {
    name: 'controlGameSetup',
    inputType: 'checkbox',
    tab: 'general',
    translationKey: 'cfg.controlGameSetup',
    access: 'ReadWrite',
    validation: null,
  },
]

// Konfigurationstabs
export const tabs = [
  { id: 'general', label: 'ui.tabs.general' },
  { id: 'raceWeekend', label: 'ui.tabs.raceWeekend' },
  { id: 'session', label: 'ui.tabs.session'},
  { id: 'track', label: 'ui.tabs.track'},
  { id: 'vehicles', label: 'ui.tabs.vehicles' },
  { id: 'rules', label: 'ui.tabs.rules' },
]

// Zuordnung der Konfigurationstabs 
export const tabRegistry = {
  general: {
    label: 'ui.tabs.general',
    objects: ['server', 'httpApi', 'luaApi', 'gameSetup'],
  },
  session: {
    label: 'ui.tabs.session',
    objects: ['attributes/session'],
  },
  track: {
    label: 'ui.tabs.track',
    objects: ['track'],
  },
  vehicles: {
    label: 'ui.tabs.vehicles',
    objects: ['vehicle', 'vehicle_class'],
  },
  rules: {
    label: 'ui.tabs.rules',
    objects: ['rules'],
  },
}

// Ausnahmen für die Feld-Tab-Zuordnung
export const fieldTabOverrides = {
  ServerControlsSetup: 'general',
  PASSWORD_PROTECTED: 'general',
  
  //Rennwochenende
  PracticeLength: 'raceWeekend',
  PracticeDateHour: 'raceWeekend',
  QualifyLength: 'raceWeekend',
  QualifyDateHour: 'raceWeekend',
  RaceLength: 'raceWeekend',
  RaceDateHour: 'raceWeekend',
  TIMED_RACE: 'raceWeekend',
  RaceExtraLap: 'raceWeekend',
  COOLDOWNLAP: 'raceWeekend',
  RaceRollingStart: 'raceWeekend',
  RaceFormationLap: 'raceWeekend',
  
  // Strecke
  ServerControlsTrack: 'track',
  TrackId: 'track',

  // Wetter
  PracticeWeatherSlots: 'track',
  PracticeWeatherSlot1: 'track',
  PracticeWeatherSlot2: 'track',
  PracticeWeatherSlot3: 'track',
  PracticeWeatherSlot4: 'track',

  QualifyWeatherSlots: 'track',
  QualifyWeatherSlot1: 'track',
  QualifyWeatherSlot2: 'track',
  QualifyWeatherSlot3: 'track',
  QualifyWeatherSlot4: 'track',

  RaceWeatherSlots: 'track',
  RaceWeatherSlot1: 'track',
  RaceWeatherSlot2: 'track',
  RaceWeatherSlot3: 'track',
  RaceWeatherSlot4: 'track',

  // Fahrzeuge
  FORCE_SAME_VEHICLE_CLASS: 'vehicles',
  FORCE_MULTI_VEHICLE_CLASS: 'vehicles',
  VehicleModelId: 'vehicles',
  VehicleClassId: 'vehicles',
  ServerControlsVehicleClass: 'vehicles',
  ServerControlsVehicle: 'vehicles',
  MultiClassSlots: 'vehicles',
  MultiClassSlot1: 'vehicles',
  MultiClassSlot2: 'vehicles',
  MultiClassSlot3: 'vehicles',

  // Regeln
  PenaltiesType: 'rules',
  PitWhiteLinePenalty: 'rules',
  DriveThroughPenalty: 'rules',
  AllowedCutsBeforePenalty: 'rules',
  PitSpeedLimit: 'rules',
}

// Felder die in der API als Zahl geführt werden, aber Booleans sind
export const booleanLikeFields = new Set([
  'AutoAdvanceSession',
  'DriveThroughPenalty',
  'PitWhiteLinePenalty',
  'ManualRollingStarts',
  'FullCourseYellows',
  'QualifyPrivateSession',
  'RaceExtraLap',
  'RaceRollingStart',
  'RaceMandatoryPitStops',
  'RaceFormationLap',
  'ServerControlsSetup',
  'ServerControlsTrack',
  'ServerControlsVehicleClass',
  'ServerControlsVehicle'
])

// Felder die in der API als Zahl geführt werden, aber Enums sind
export const enumLikeFields = new Set([
  'QualifyWeatherSlot1',
  'QualifyWeatherSlot2',
  'QualifyWeatherSlot3',
  'QualifyWeatherSlot4',
  'PracticeWeatherSlot1',
  'PracticeWeatherSlot2',
  'PracticeWeatherSlot3',
  'PracticeWeatherSlot4',
  'RaceWeatherSlot1',
  'RaceWeatherSlot2',
  'RaceWeatherSlot3',
  'RaceWeatherSlot4',

  'TrackId',
  'PenaltiesType',
  'VehicleClassId',
  'VehicleModelId',
  'MultiClassSlot1',
  'MultiClassSlot2',
  'MultiClassSlot3',

  'DamageType',
  'DamageScale',
  'FuelUsageType',
  'TireWearType',
])

export const fieldRequiresControlGameSetup = new Set([
    'ServerControlsTrack',
    'MaxPlayers',
    //'FILL_SESSION_WITH_AI',
    'MultiClassSlots',
    'MultiClassSlot1',
    'MultiClassSlot2',
    'MultiClassSlot3',
    'VehicleClassId',
    'VehicleModelId',
    'ServerControlsVehicleClass',
    'ServerControlsVehicle',
])
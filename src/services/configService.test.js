import test from 'node:test'
import assert from 'node:assert/strict'
import { getConfigValue, updateConfigValue } from './configService.js'

const flag = (name, flagValue) => ({
  name,
  flagGroup: 'sessionFlags',
  flagValue,
  section: 'sessionAttributes',
})

test('getConfigValue liest einfache, verschachtelte und Flag-Werte', () => {
  const config = {
    name: 'Server',
    sessionAttributes: { Flags: 6, GridSize: 12 },
  }

  assert.equal(getConfigValue(config, 'name'), 'Server')
  assert.equal(getConfigValue(config, { name: 'GridSize', section: 'sessionAttributes' }), 12)
  assert.equal(getConfigValue(config, flag('EXAMPLE', 2)), true)
  assert.equal(getConfigValue(config, flag('MISSING', 8)), false)
  assert.equal(getConfigValue(config, 'missing'), '')
})

test('updateConfigValue ändert verschachtelte Werte ohne das Original zu verändern', () => {
  const original = { sessionAttributes: { GridSize: 8 } }
  const updated = updateConfigValue(
    original,
    { name: 'RaceLength', section: 'sessionAttributes' },
    20,
    {},
  )

  assert.equal(updated.sessionAttributes.RaceLength, 20)
  assert.equal(original.sessionAttributes.RaceLength, undefined)
})

test('Spielerzahländerungen synchronisieren GridSize, MaxPlayers und KI-Flag', () => {
  const config = {
    maxPlayerCount: 16,
    controlGameSetup: true,
    sessionAttributes: { GridSize: 16, MaxPlayers: 16, Flags: 0 },
  }
  const smaller = updateConfigValue(config, { name: 'maxPlayerCount' }, 10, {})
  assert.equal(smaller.sessionAttributes.GridSize, 10)
  assert.equal(smaller.sessionAttributes.MaxPlayers, 10)
  assert.equal(smaller.sessionAttributes.Flags & 131072, 0)

  const larger = updateConfigValue(config, { name: 'maxPlayerCount' }, 20, {})
  assert.equal(larger.sessionAttributes.GridSize, 20)
  assert.equal(larger.sessionAttributes.MaxPlayers, 16)
  assert.equal(larger.sessionAttributes.Flags & 131072, 131072)
})

test('Passwort setzt Schutzflag und das Deaktivieren des Flags leert das Passwort', () => {
  const config = { server: { password: '' }, sessionAttributes: { Flags: 0 } }
  const withPassword = updateConfigValue(config, { name: 'password' }, 'secret', {})
  assert.equal(withPassword.sessionAttributes.Flags & 4194304, 4194304)

  const withoutProtection = updateConfigValue(
    withPassword,
    flag('PASSWORD_PROTECTED', 4194304),
    false,
    {},
  )
  assert.equal(withoutProtection.server.password, '')
  assert.equal(withoutProtection.sessionAttributes.Flags & 4194304, 0)
})

test('Wetter-Slots werden mit Standardwerten angelegt und überzählige Slots entfernt', () => {
  const config = {
    sessionAttributes: { PracticeWeatherSlot1: 99, PracticeWeatherSlot3: 88 },
  }
  const options = { 'enums.weather': [{ value: 7 }, { value: 8 }] }
  const updated = updateConfigValue(
    config,
    { name: 'PracticeWeatherSlots', section: 'sessionAttributes' },
    2,
    options,
  )

  assert.equal(updated.sessionAttributes.PracticeWeatherSlot1, 99)
  assert.equal(updated.sessionAttributes.PracticeWeatherSlot2, 7)
  assert.equal(updated.sessionAttributes.PracticeWeatherSlot3, undefined)
})

test('deaktivierte Trainings- und Regeloptionen entfernen abhängige Werte', () => {
  const config = {
    sessionAttributes: {
      PracticeLength: 10,
      PracticeWeatherSlots: 1,
      PracticeWeatherSlot1: 4,
      PracticeWeatherProgression: 5,
      PitWhiteLinePenalty: true,
      PitSpeedLimit: 80,
    },
  }
  const noPractice = updateConfigValue(
    config,
    { name: 'PracticeLength', section: 'sessionAttributes' },
    0,
    {},
  )
  assert.equal(noPractice.sessionAttributes.PracticeWeatherSlots, undefined)
  assert.equal(noPractice.sessionAttributes.PracticeWeatherSlot1, undefined)
  assert.equal(noPractice.sessionAttributes.PracticeWeatherProgression, undefined)

  const noPenalties = updateConfigValue(
    config,
    { name: 'PenaltiesType', section: 'sessionAttributes' },
    0,
    {},
  )
  assert.equal(noPenalties.sessionAttributes.PitWhiteLinePenalty, undefined)
  assert.equal(noPenalties.sessionAttributes.PitSpeedLimit, undefined)
})

test('Fahrzeugsteuerung und Mehrklassenwahl halten ihre Abhängigkeiten konsistent', () => {
  const options = {
    vehicle_classes: [{ value: 22 }],
    vehicles: [{ id: 33 }],
  }
  const config = { sessionAttributes: { Flags: 0, MultiClassSlots: 0 } }
  const classControl = updateConfigValue(
    config,
    { name: 'ServerControlsVehicleClass', section: 'sessionAttributes' },
    true,
    options,
  )
  assert.equal(classControl.sessionAttributes.VehicleClassId, 22)
  assert.equal(classControl.sessionAttributes.Flags & 512, 512)

  const multiClass = updateConfigValue(
    { sessionAttributes: { Flags: 0, MultiClassSlots: 0, MultiClassSlot1: 4, MultiClassSlot3: 6 } },
    { name: 'MultiClassSlots', section: 'sessionAttributes' },
    1,
    options,
  )
  assert.equal(multiClass.sessionAttributes.MultiClassSlot1, 4)
  assert.equal(multiClass.sessionAttributes.MultiClassSlot3, undefined)
  assert.equal(multiClass.sessionAttributes.ServerControlsVehicleClass, false)
  assert.equal(multiClass.sessionAttributes.Flags & 1024, 1024)
})

test('Deaktivieren der Setup-Kontrolle bereinigt abhängige Felder und KI-Werte', () => {
  const config = {
    sessionAttributes: {
      Flags: 131072,
      GridSize: 12,
      MaxPlayers: 8,
      OpponentDifficulty: 90,
      ServerControlsTrack: true,
      MultiClassSlots: 1,
      VehicleModelId: 5,
    },
  }
  const updated = updateConfigValue(config, { name: 'controlGameSetup' }, false, {})

  assert.equal(updated.sessionAttributes.MaxPlayers, 12)
  assert.equal(updated.sessionAttributes.OpponentDifficulty, undefined)
  assert.equal(updated.sessionAttributes.ServerControlsTrack, undefined)
  assert.equal(updated.sessionAttributes.MultiClassSlots, undefined)
  assert.equal(updated.sessionAttributes.VehicleModelId, undefined)
})
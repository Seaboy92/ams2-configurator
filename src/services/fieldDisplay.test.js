import test from 'node:test'
import assert from 'node:assert/strict'
import { getFieldOrder, isFieldDisabled, isFieldVisible, sortConfigSection } from './fieldDisplay.js'

test('isFieldVisible wendet feste und konfigurationsabhängige Regeln an', () => {
  assert.equal(isFieldVisible({ name: 'GridSize' }, {}), false)
  assert.equal(isFieldVisible({ name: 'UnknownField' }, {}), true)
  assert.equal(isFieldVisible({ name: 'OpponentDifficulty' }, {
    sessionAttributes: { GridSize: 20, MaxPlayers: 10 },
  }), true)
  assert.equal(isFieldVisible({ name: 'OpponentDifficulty' }, {
    sessionAttributes: { GridSize: 10, MaxPlayers: 10 },
  }), false)
  assert.equal(isFieldVisible({ name: 'RaceExtraLap' }, { sessionAttributes: { Flags: 1048576 } }), true)
})

test('isFieldDisabled berücksichtigt Setup-Kontrolle und Fahrzeugkonflikte', () => {
  assert.equal(isFieldDisabled({ name: 'MaxPlayers' }, { controlGameSetup: false }), true)
  assert.equal(isFieldDisabled({ name: 'UnknownField' }, {}), false)
  assert.equal(isFieldDisabled({ name: 'ServerControlsVehicleClass' }, {
    controlGameSetup: true,
    sessionAttributes: { ServerControlsVehicle: true },
  }), true)
})

test('sortConfigSection ordnet bekannte Felder und lässt unbekannte danach stehen', () => {
  assert.equal(getFieldOrder({ name: 'name' }), 0)
  assert.equal(getFieldOrder({ name: 'UnknownField' }), 999)
  assert.deepEqual(Object.keys(sortConfigSection({
    UnknownField: 1,
    RaceLength: 2,
    name: 3,
  })), ['name', 'RaceLength', 'UnknownField'])
})
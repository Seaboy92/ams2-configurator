import test from 'node:test'
import assert from 'node:assert/strict'
import { createAllFields, mapEnumToType, mapTypeToInput } from './fieldMapper.js'

test('mapTypeToInput berücksichtigt Booleans, Enums, Zahlen und Fallbacks', () => {
  assert.equal(mapTypeToInput({ name: 'ServerControlsTrack', type: 'int8' }), 'checkbox')
  assert.equal(mapTypeToInput({ name: 'TrackId', type: 'int32' }), 'select')
  assert.equal(mapTypeToInput({ name: 'PracticeLength', type: 'int32' }), 'number')
  assert.equal(mapTypeToInput({ name: 'Payload', type: 'textbox' }), 'textbox')
  assert.equal(mapTypeToInput({ name: 'Other', type: 'unknown' }), 'text')
})

test('mapEnumToType ordnet Select-Felder ihren Optionsquellen zu', () => {
  assert.equal(mapEnumToType({ name: 'RaceWeatherSlot1' }, 'select'), 'enums.weather')
  assert.equal(mapEnumToType({ name: 'DamageScale' }, 'select'), 'enums.damage_scale')
  assert.equal(mapEnumToType({ name: 'VehicleModelId' }, 'select'), 'vehicles')
  assert.equal(mapEnumToType({ name: 'TrackId' }, 'select'), 'tracks')
  assert.equal(mapEnumToType({ name: 'PlainText' }, 'text'), undefined)
})

test('createAllFields überspringt schreibgeschützte und fremde Felder und ergänzt Flags/Custom-Felder', () => {
  const fields = createAllFields({
    'attributes/session': {
      list: [
        { name: 'PracticeLength', type: 'int32', access: 'ReadWrite' },
        { name: 'ServerControlsTrack', type: 'int8', access: 'ReadOnly' },
        null,
      ],
    },
    'other/object': { list: [{ name: 'Ignored', type: 'int32', access: 'ReadWrite' }] },
    'flags/session': { list: [{ name: 'TIMED_RACE', value: 1048576 }] },
  })

  assert.ok(fields.some(field => field.name === 'PracticeLength' && field.inputType === 'number'))
  assert.ok(fields.some(field => field.name === 'TIMED_RACE' && field.flagGroup === 'sessionFlags'))
  assert.ok(fields.some(field => field.name === 'name'))
  assert.equal(fields.some(field => field.name === 'Ignored'), false)
  assert.equal(fields.some(field => field.name === 'ServerControlsTrack' && field.access === 'ReadOnly'), false)
})
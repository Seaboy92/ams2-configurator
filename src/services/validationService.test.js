import test from 'node:test'
import assert from 'node:assert/strict'
import { getValidationValue, validateField, validationMap } from './validationService.js'

test('validateField akzeptiert fehlende optionale Werte und Felder ohne Regeln', () => {
  assert.deepEqual(validateField('name', '', null), { valid: true })
  assert.deepEqual(validateField('optional', '', { min: 1 }), { valid: true })
})

test('validateField prüft Pflichtfelder, Ganzzahlen und Grenzen', () => {
  assert.equal(validateField('name', '  ', { required: true }).valid, false)
  assert.equal(validateField('count', '2.5', { integer: true }).valid, false)
  assert.equal(validateField('count', 1, { min: 2 }).valid, false)
  assert.equal(validateField('count', 33, { max: 32 }).valid, false)
  assert.deepEqual(validateField('count', '12', { min: 2, max: 32, integer: true }), { valid: true })
})

test('validateField prüft Schrittweiten relativ zum Minimum', () => {
  assert.equal(validateField('speed', 42, { min: 40, step: 5 }).valid, false)
  assert.deepEqual(validateField('speed', 45, { min: 40, step: 5 }), { valid: true })
})

test('dynamische Validierungsgrenzen berücksichtigen die aktuelle Konfiguration', () => {
  const config = { sessionAttributes: { GridSize: 10, QualifyLength: 0, PracticeLength: 5 } }
  assert.equal(getValidationValue(validationMap.MaxPlayers, 'max', config), 10)
  assert.equal(getValidationValue(validationMap.PracticeLength, 'min', config), 1)
  assert.equal(getValidationValue(validationMap.QualifyLength, 'min', config), 0)
  assert.equal(getValidationValue({}, 'unknown', config), undefined)
})
import test from 'node:test'
import assert from 'node:assert/strict'
import { loadCars, searchCars } from './carService.js'

const cars = [
  { id: 1, cars: 'Example GT3', class: 'GT3', dlc: 'Standard', isDlc: false },
  { id: 2, cars: 'Example Classic', class: 'Vintage', dlc: 'Pack A', isDlc: true },
]

test('searchCars findet Namen, Klassen und DLC ohne Beachtung der Groß-/Kleinschreibung', () => {
  assert.deepEqual(searchCars(cars, { search: 'EXAMPLE' }), cars)
  assert.deepEqual(searchCars(cars, { search: 'gt3' }), [cars[0]])
  assert.deepEqual(searchCars(cars, { search: 'pack a' }), [cars[1]])
})

test('searchCars filtert Standard-DLC und DLC und kann Filter kombinieren', () => {
  assert.deepEqual(searchCars(cars, { dlc: 'standard' }), [cars[0]])
  assert.deepEqual(searchCars(cars, { dlc: 'dlc' }), [cars[1]])
  assert.deepEqual(searchCars(cars, { search: 'classic', dlc: 'standard' }), [])
  assert.deepEqual(searchCars(cars, { search: 'nicht vorhanden' }), [])
})

test('loadCars liest die CSV und liefert normalisierte Fahrzeugdaten', () => {
  const loaded = loadCars()
  assert.ok(loaded.length > 0)
  assert.ok(loaded.every(car => Number.isInteger(car.id)))
  assert.ok(loaded.some(car => car.cars === 'Citroen DS3RX'))
  assert.ok(loaded.every(car => typeof car.isDlc === 'boolean'))
})
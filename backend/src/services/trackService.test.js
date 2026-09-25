import test from 'node:test'
import assert from 'node:assert/strict'
import { loadTracks, searchTracks } from './trackService.js'

const tracks = [
  { id: 1, track: 'Monza', variant: 'Grand Prix', dlc: 'Standard', isDlc: false },
  { id: 2, track: 'Spa', variant: 'Historic', dlc: 'Pack A', isDlc: true },
]

test('searchTracks sucht ohne Beachtung der Groß-/Kleinschreibung in Name, Variante und DLC', () => {
  assert.deepEqual(searchTracks(tracks, { search: 'MONZA' }), [tracks[0]])
  assert.deepEqual(searchTracks(tracks, { search: 'historic' }), [tracks[1]])
  assert.deepEqual(searchTracks(tracks, { search: 'pack a' }), [tracks[1]])
})

test('searchTracks filtert Standard-DLC und DLC unabhängig voneinander', () => {
  assert.deepEqual(searchTracks(tracks, { dlc: 'standard' }), [tracks[0]])
  assert.deepEqual(searchTracks(tracks, { dlc: 'dlc' }), [tracks[1]])
  assert.deepEqual(searchTracks(tracks, { dlc: 'all' }), tracks)
})

test('searchTracks kombiniert Suchbegriff und DLC und liefert bei keinem Treffer ein leeres Array', () => {
  assert.deepEqual(searchTracks(tracks, { search: 'spa', dlc: 'standard' }), [])
  assert.deepEqual(searchTracks(tracks, { search: 'kein treffer' }), [])
})

test('loadTracks liest die CSV und liefert normalisierte Streckendaten', () => {
  const loaded = loadTracks()
  assert.ok(loaded.length > 0)
  assert.ok(loaded.every(track => Number.isInteger(track.id)))
  assert.ok(loaded.some(track => track.track === 'Adelaide'))
  assert.ok(loaded.every(track => typeof track.isDlc === 'boolean'))
})
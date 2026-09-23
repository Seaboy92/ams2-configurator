import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from './app.js'
import { withTestServer } from './testHelpers.js'

test('health route gibt eine erfolgreiche Statusantwort zurück', async () => {
  await withTestServer(createApp(), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`)
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { status: 'ok' })
  })
})

test('options route gibt bekannte Optionen zurück und lehnt fehlende oder unbekannte Quellen ab', async () => {
  await withTestServer(createApp(), async (baseUrl) => {
    const valid = await fetch(`${baseUrl}/api/options?source=enums.weather`)
    const options = await valid.json()
    assert.equal(valid.status, 200)
    assert.ok(Array.isArray(options))
    assert.ok(options.length > 0)

    for (const url of ['/api/options', '/api/options?source=unknown']) {
      const invalid = await fetch(`${baseUrl}${url}`)
      assert.equal(invalid.status, 400)
      assert.equal((await invalid.json()).error, 'Unbekannte Optionsquelle.')
    }
  })
})

test('fields route gibt Definitionen von Sitzungsattributen und Flags zurück', async () => {
  await withTestServer(createApp(), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/fields`)
    const fields = await response.json()
    assert.equal(response.status, 200)
    assert.ok(Array.isArray(fields['attributes/session'].list))
    assert.ok(Array.isArray(fields['flags/session'].list))
  })
})

test('tracks route unterstützt Such- und DLC-Abfragefilter', async () => {
  await withTestServer(createApp(), async (baseUrl) => {
    const allResponse = await fetch(`${baseUrl}/api/tracks`)
    const allTracks = await allResponse.json()
    assert.equal(allResponse.status, 200)
    assert.ok(allTracks.length > 0)

    const searched = await fetch(`${baseUrl}/api/tracks?search=adelaide`)
    const searchResults = await searched.json()
    assert.ok(searchResults.length > 0)
    assert.ok(searchResults.every(track =>
      `${track.track} ${track.variant} ${track.dlc}`.toLowerCase().includes('adelaide')
    ))

    const standard = await fetch(`${baseUrl}/api/tracks?dlc=standard`)
    assert.ok((await standard.json()).every(track => !track.isDlc))
  })
})

test('vehicle route ermöglicht die Suche nach Fahrzeugname und -klasse', async () => {
  await withTestServer(createApp(), async (baseUrl) => {
    const nameResponse = await fetch(`${baseUrl}/api/VehicleModelId?search=Citroen%20DS3RX`)
    const nameResults = await nameResponse.json()
    assert.equal(nameResponse.status, 200)
    assert.ok(nameResults.length > 0)
    assert.ok(nameResults.every(car => car.cars.toLowerCase().includes('citroen ds3rx')))

    const classResponse = await fetch(`${baseUrl}/api/VehicleModelId?search=rallycross`)
    const classResults = await classResponse.json()
    assert.ok(classResults.length > 0)
    assert.ok(classResults.every(car => car.class.toLowerCase().includes('rallycross')))
  })
})

import { readFileSync } from 'node:fs'
import { parse } from 'csv-parse/sync'
import apiIds from '../data/api_ids.json' with { type: 'json' }

const gridSizeByTrackId = new Map(
  apiIds.tracks.list.map((track) => [track.id, track.gridsize])
)

const tracksFileUrl = new URL(
  '../data/tracks_with_ids.csv',
  import.meta.url
)

function toTrack(row) {
  const id = Number(row.NumericID)
  const gridSize = gridSizeByTrackId.get(id)

  if (!Number.isInteger(id)) {
    throw new Error(
      `Ungültige NumericID für Strecke "${row.ID}"`
    )
  }

  return {
    id,
    key: row.ID,
    track: row.Track,
    variant: row.Variante,
    dlc: row['Game-DLCc'],
    isDlc: row['Game-DLCc'] !== 'Standard',
    gridSize,
  }
}

export function loadTracks() {
  const csvText = readFileSync(tracksFileUrl, 'utf8')

  const rows = parse(csvText, {
    columns: true,
    delimiter: ';',
    trim: true,
    skip_empty_lines: true,
  })

  return rows.map(toTrack)
}

export function searchTracks(tracks, { search, dlc }) {
  let result = tracks

  if (search) {
    const normalizedSearch = search.toLowerCase()

    result = result.filter((track) => {
      const searchableText =
        `${track.track} ${track.variant} ${track.dlc}`
          .toLowerCase()

      return searchableText.includes(normalizedSearch)
    })
  }

  if (dlc === 'standard') {
    result = result.filter((track) => !track.isDlc)
  }

  if (dlc === 'dlc') {
    result = result.filter((track) => track.isDlc)
  }

  return result
}
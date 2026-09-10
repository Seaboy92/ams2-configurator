import { readFileSync } from 'node:fs'
import { parse } from 'csv-parse/sync'

const carFileUrl = new URL(
  '../data/cars_with_ids.csv',
  import.meta.url
)

function toCar(row) {
  const id = Number(row.Id)

  if (!Number.isInteger(id)) {
    throw new Error(
      `Ungültige ID für Auto "${row.ID}"`
    )
  }

  return {
    id,
    cars: row.Cars,
    class: row.CarClass,
    dlc: row['Game-DLCc'],
    isDlc: row['Game-DLCc'] !== 'Standard',
  }
}

export function loadCars() {
  const csvText = readFileSync(carFileUrl, 'utf8')

  const rows = parse(csvText, {
    columns: true,
    delimiter: ';',
    trim: true,
    skip_empty_lines: true,
  })

  return rows.map(toCar)
}

export function searchCars(cars, { search, dlc }) {
  let result = cars

  if (search) {
    const normalizedSearch = search.toLowerCase()

    result = result.filter((car) => {
      const searchableText =
        `${car.key} ${car.class} ${car.dlc}`
          .toLowerCase()

      return searchableText.includes(normalizedSearch)
    })
  }

  if (dlc === 'standard') {
    result = result.filter((car) => !car.isDlc)
  }

  if (dlc === 'dlc') {
    result = result.filter((car) => car.isDlc)
  }

  return result
}
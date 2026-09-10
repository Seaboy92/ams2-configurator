import { Router } from 'express'
import apiIds from '../data/api_ids.json' with { type: 'json' }

const router = Router()

const optionSources = {
  'enums.weather': 'enums/weather',
  'enums.damage': 'enums/damage',
  'enums.damage_scale': 'enums/damage_scale',
  'enums.penalties': 'enums/penalties',
  'vehicle_classes': 'vehicle_classes',
  'enums.fuel_usage': 'enums/fuel_usage',
}

router.get('/', (request, response) => {
  const source = request.query.source
  const dataKey = optionSources[source]

  if (!dataKey) {
    return response.status(400).json({
      error: 'Unbekannte Optionsquelle.'
    })
  }

  const options = apiIds[dataKey]?.list

  if (!options) {
    return response.status(404).json({
      error: 'Für diese Quelle sind keine Optionen vorhanden.'
    })
  }

  return response.json(options)
})

export default router
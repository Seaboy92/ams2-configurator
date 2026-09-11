import { Router } from 'express'
import { loadCars, searchCars } from '../services/carService.js'

const router = Router()

const cars = loadCars()

router.get('/', (request, response) => {
  const result = searchCars(cars, {
    search: request.query.search,
    dlc: request.query.dlc,
  })

  response.json(result)
})

export default router
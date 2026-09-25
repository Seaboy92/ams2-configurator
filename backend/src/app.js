import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import optionsRouter from './routes/options.js'
import fieldsRouter from './routes/fields.js'
import tracksRouter from './routes/tracks.js'
import carsRouter from './routes/cars.js'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const frontendDist = path.resolve(currentDirectory, '../../dist')

// Die App wird getrennt vom Listener exportiert, damit Tests sie ohne festen Port starten können. Der Produktionsserver bleibt in server.js.
export function createApp() {
  const app = express()

  app.use(express.json())

  app.get('/api/health', (request, response) => {
    response.json({ status: 'ok' })
  })

  app.use('/api/options', optionsRouter)
  app.use('/api/fields', fieldsRouter)
  app.use('/api/tracks', tracksRouter)
  app.use('/api/VehicleModelId', carsRouter)

  // Produktions-Build des Frontends als statische Dateien ausliefern.
  app.use(express.static(frontendDist))

  return app
}
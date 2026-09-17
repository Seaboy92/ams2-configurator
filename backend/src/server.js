import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import optionsRouter from './routes/options.js'
import fieldsRouter from './routes/fields.js'
import tracksRouter from './routes/tracks.js'
import carsRouter from './routes/cars.js'

const app = express()
const port = process.env.PORT || 3001

const currentFile = fileURLToPath(import.meta.url)
const currentDirectory = path.dirname(currentFile)
const frontendDist = path.resolve(currentDirectory, '../../dist')

app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/options', optionsRouter)
app.use('/api/fields', fieldsRouter)
app.use('/api/tracks', tracksRouter)
app.use('/api/VehicleModelId', carsRouter)

/* Liefert die gebaute React-Anwendung aus. */
app.use(express.static(frontendDist))

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`)
})
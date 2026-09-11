import express from 'express'
import cors from 'cors'
import optionsRouter from './routes/options.js'
import fieldsRouter from './routes/fields.js'
import tracksRouter from './routes/tracks.js'
import carsRouter from './routes/cars.js'

const app = express()
const port = 3001

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/options', optionsRouter)
app.use('/api/fields', fieldsRouter)
app.use('/api/tracks', tracksRouter)
app.use('/api/VehicleModelId', carsRouter)

app.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`)
})
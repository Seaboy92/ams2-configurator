import express from 'express'
import cors from 'cors'
import optionsRouter from './routes/options.js'
import fieldsRouter from './routes/fields.js'

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

app.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`)
})
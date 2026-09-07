import { Router } from 'express'
import { loadTracks, searchTracks } from '../services/trackService.js'

const router = Router()

const tracks = loadTracks()

router.get('/', (request, response) => {
  const result = searchTracks(tracks, {
    search: request.query.search,
    dlc: request.query.dlc,
  })

  response.json(result)
})

export default router
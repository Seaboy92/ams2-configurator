import { Router } from 'express'
import apiIds from '../data/api_ids.json' with { type: 'json' }

const router = Router()

router.get('/', (request, response) => {
  response.json({
    'attributes/session': apiIds['attributes/session'],
    'flags/session': apiIds['flags/session'],
  })
})

export default router
import { once } from 'node:events'

// Bindet an Port 0, damit parallele lokale Prozesse/Tests keine Portkollisionen haben.
export async function withTestServer(app, run) {
  const server = app.listen(0)
  await once(server, 'listening')

  const { port } = server.address()
  try {
    await run(`http://127.0.0.1:${port}`)
  } finally {
    server.close()
    await once(server, 'close')
  }
}

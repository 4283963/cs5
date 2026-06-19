/**
 * local server entry file, for local development
 */
import app from './app.js'
import { initDb } from './db/index.js'

const PORT = process.env.PORT || 3001

async function bootstrap() {
  await initDb()
  const server = app.listen(PORT, () => {
    console.log(`Server ready on port ${PORT}`)
  })

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received')
    server.close(() => {
      console.log('Server closed')
      process.exit(0)
    })
  })

  process.on('SIGINT', () => {
    console.log('SIGINT signal received')
    server.close(() => {
      console.log('Server closed')
      process.exit(0)
    })
  })
}

bootstrap()

export default app

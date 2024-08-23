import { Hono } from 'hono'
import { ZodError } from 'zod'
// import { routes } from './routes'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())


app.get('/', (c) => {
  return c.text('Gigblocks Server Running On Hono!')
})

app.onError((error, c) => {

  console.log(error)

  if (error instanceof ZodError) {
    console.log(error)
    return c.json({ error, message: error.message }, { status: 403 })
  }

  if (error instanceof HTTPException) {
    // Get the custom response
    return error.getResponse()
  }

  console.log(c.error)
  return c.json(
    { error, message: error.message || 'Custom Error Message' },
    500,
  )
})

app.notFound(c => {
  console.error(`not found${c}`)
  return c.text('404 Not found', 404)
})

export default app

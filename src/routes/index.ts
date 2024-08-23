import { Hono } from 'hono'
import { logger } from 'hono/logger'

import jobs from './jobs.route'

export const routes = (app: Hono) => {
    app.use('*', logger())
    
    app.route('/jobs', jobs)
}
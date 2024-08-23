import { Hono } from 'hono'
import { logger } from 'hono/logger'

import jobs from './jobs.route'
import profiles from './profiles.route'
import ens from './ens.route'
import files from './files.route'

export const routes = (app: Hono) => {
    app.use('*', logger())

    app.route('/jobs', jobs)
    app.route('/profiles', profiles)
    app.route('/ens', ens)
    app.route('/files', files)
}
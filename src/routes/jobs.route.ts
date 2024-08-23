import { Hono } from 'hono'


const jobs = new Hono()

jobs.get('/', async (c) => {

    return c.json({message: "Job Lists!"})
})

export default jobs
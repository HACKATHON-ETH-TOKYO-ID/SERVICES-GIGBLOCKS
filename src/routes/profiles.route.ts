import { Hono } from 'hono'

const profiles = new Hono()

profiles.get('/:wallet', async (c) => {

    return c.json({message: "Return Profile Detail"})
})


export default profiles
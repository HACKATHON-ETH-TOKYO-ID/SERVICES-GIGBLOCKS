import { Hono } from 'hono'
import { getAccessTokenFromCode } from '../services/auth.services';

const auth = new Hono()

auth.post('/github', async (c) => {
    const body = await c.req.json()
    
    const githubAccessToken = await getAccessTokenFromCode(body.code);

    return c.json(githubAccessToken)
})

export default auth
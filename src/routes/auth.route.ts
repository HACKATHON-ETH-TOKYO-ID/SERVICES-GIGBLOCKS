import { Hono } from 'hono'
import { getAccessTokenFromCode } from '../services/auth.services';

const auth = new Hono()

auth.post('/github/:code', async (c) => {
    const code = c.req.param('code')
    
    const githubAccessToken = await getAccessTokenFromCode(code);

    return c.json(githubAccessToken)
})

export default auth
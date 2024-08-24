import { Hono } from 'hono'
import { generateSignature, getAccessTokenFromCode, getAccessTokenLinkedin } from '../services/auth.services';


const auth = new Hono()


auth.post('/github', async (c) => {
    const body = await c.req.json()
    const githubAccessToken : string = await getAccessTokenFromCode(body.code);

    if(!githubAccessToken){
        throw Error("Github Access Token Error!")
    }

    const { messageHash, signature } = await generateSignature(body.walletAddress, 'github')

    return c.json({ messageHash, signature });
})


auth.post('/linkedin', async (c) => {
    const body = await c.req.json()
    const linkedinAccessToken : string = await getAccessTokenLinkedin(body.code);

    if(!linkedinAccessToken){
        throw Error("Github Access Token Error!")
    }

    const { messageHash, signature } = await generateSignature(body.walletAddress, 'linkedin')

    return c.json({ messageHash, signature });
})

export default auth
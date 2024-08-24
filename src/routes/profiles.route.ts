import { Hono } from 'hono'
import { ProfileIPFSSchema } from '../schema/profiles.schema'
import { zValidator } from '@hono/zod-validator'
import { uploadJsonIPFS } from '../helper/pinata'
import { getProfile, getReputation } from '../services/profiles.services'


const profiles = new Hono()

profiles.get('/:wallet', async (c) => {
    const wallet = c.req.param('wallet')
    const profile = await getProfile(wallet)

    return c.json(profile)
})

profiles.post('/uploadIpfs', zValidator('json', ProfileIPFSSchema), async (c) => {
    const profileDetail = c.req.valid('json');

    const responsePinata = await uploadJsonIPFS(profileDetail);

    return c.json(responsePinata)
})

profiles.get('/reputation/:wallet', async (c) => {
    const walletAddress = c.req.param('wallet')

    const reputationData = await getReputation(walletAddress);

    return c.json(reputationData)
})


export default profiles
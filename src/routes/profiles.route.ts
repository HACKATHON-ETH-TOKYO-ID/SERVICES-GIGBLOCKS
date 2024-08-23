import { Hono } from 'hono'
import { ProfileIPFSSchema } from '../schema/profiles.schema'
import { zValidator } from '@hono/zod-validator'
import { uploadJsonIPFS } from '../helper/pinata'
import { getProfile } from '../services/profiles.services'


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


export default profiles
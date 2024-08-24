import { Hono } from 'hono'
import { getActiveJobs, getClientJobs, getFreelancerJobs, getJobApplicants, getJobById } from '../services/jobs.services'
import { uploadJsonIPFS } from '../helper/pinata'
import { zValidator } from '@hono/zod-validator'
import { JobIPFSSchema, } from '../schema/jobs.schema'

const jobs = new Hono()

jobs.get('/', async (c) => {
    const offset = Number(c.req.query('offset')) || 0
    const limit = Number(c.req.query('limit')) || 10
    
    let jobsData = await getActiveJobs(offset, limit);

    console.log(jobsData)

    return c.json(jobsData)
})

jobs.get('/:jobId', async (c) => {
    const jobId = c.req.param('jobId')

    
    let jobData = await getJobById(Number(jobId));

    return c.json(jobData)
})

jobs.get('/byClient/:wallet', async (c) => {
    const offset = Number(c.req.query('offset')) || 0
    const limit = Number(c.req.query('limit')) || 10
    const status = Number(c.req.query('status'))
    const wallet = c.req.param('wallet')

    let jobsData = await getClientJobs(wallet, offset, limit);

    let filteredJobs = jobsData.filter(obj => obj.status == status)

    return c.json(filteredJobs)
})

jobs.get('/byFreelancer/:wallet', async (c) => {
    const offset = Number(c.req.query('offset')) || 0
    const limit = Number(c.req.query('limit')) || 10
    const status = Number(c.req.query('status'))
    const wallet = c.req.param('wallet')

    let jobsData = await getFreelancerJobs(wallet, offset, limit);

    let filteredJobs = jobsData.filter(obj => obj.status == status)

    return c.json(filteredJobs)
})

jobs.post('/uploadIpfs', zValidator('json', JobIPFSSchema), async (c) => {
    const jobDetail  = c.req.valid('json');

    console.log(jobDetail)
    
    const responsePinata = await uploadJsonIPFS(jobDetail);

    return c.json(responsePinata)
})

jobs.get('/applicants/:jobId', async (c) => {
    const jobId  = c.req.param('jobId')
    const offset = Number(c.req.query('offset')) || 0
    const limit = Number(c.req.query('limit')) || 10

    
    const jobApplicants = await getJobApplicants(Number(jobId), offset, limit);

    return c.json(jobApplicants)
})




export default jobs
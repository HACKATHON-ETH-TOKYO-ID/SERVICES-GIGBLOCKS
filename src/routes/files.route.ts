import { Hono } from 'hono'
import { UploadFile } from '../schema/files.schema';
import { zValidator } from '@hono/zod-validator';
import { uploadFileIPFS } from '../helper/pinata';

const files = new Hono()

files.post('/uploadFile', zValidator('form', UploadFile), async (c) => {
    const fileData  = c.req.valid('form');

    const responsePinata = await uploadFileIPFS(fileData.file);

    return c.json(responsePinata)
})

export default files
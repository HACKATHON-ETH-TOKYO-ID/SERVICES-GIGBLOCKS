import { z } from 'zod';

const UploadFile = z.object({
    file: z.instanceof(File),
});

export {UploadFile}
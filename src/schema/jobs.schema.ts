import { z } from 'zod';

  
const JobIPFSSchema = z.object({
    jobPictureIPFS: z.string(),
    proposalIPFS: z.string(),
    title: z.string(),
    category: z.number(),
    estimateDuration: z.number(), 
    skillsRequired: z.array(z.string()),
    clientLocation: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
    description: z.string(),
});
  
type JobIPFSType = z.infer<typeof JobIPFSSchema>;


export { JobIPFSSchema , JobIPFSType};
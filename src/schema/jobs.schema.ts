import { z } from 'zod';
import { ProfileIPFSSchema } from './profiles.schema';

const ApplicantSchema = z.object({
    freelancerName: z.string(),
    freelancerWalletAddress: z.string(),
    freelancerEmail: z.string().email(),
    bidAmount: z.number(),
    bidTime: z.number(),
    coverLetter: z.string(),
  });
  
const JobIPFSSchema = z.object({
    jobPictureIPFS: z.string(),
    proposalIPFS: z.string(),
    title: z.string(),
    category: z.number(),
    priceRange: z.object({
      min: z.number(),
      max: z.number(),
    }),
    estimateDuration: z.number(), 
    skillsRequired: z.array(z.string()),
    clientLocation: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
    description: z.string(),
    detailClient: ProfileIPFSSchema, 
    applicants: z.array(ApplicantSchema),
});

const ApplyJobSchema = z.object({
    applicantData: ApplicantSchema,
    jobIpfsHash: z.string()
})
  
type JobIPFSType = z.infer<typeof JobIPFSSchema>;


export { JobIPFSSchema, ApplyJobSchema , JobIPFSType};
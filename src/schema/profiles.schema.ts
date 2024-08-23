import { z } from 'zod';

const ProfileIPFSSchema = z.object({
    username: z.string(),
    email: z.string(),
    description: z.string(),
    profileType: z.string(),
    country: z.string().optional(),
    reputation: z.array(z.any()).optional(),
    pictureIPFS: z.string().optional(),
    skills: z.array(z.string()).optional(),
    preference: z.string().optional(),
    review: z.array(z.string()).optional(),
  });

type ProfileIPFSType = z.infer<typeof ProfileIPFSSchema>;


export { ProfileIPFSSchema, ProfileIPFSType };

import { z } from 'zod';

const ReviewSchema = z.object({
    star: z.number(),
    description: z.string(),
    username: z.string(),
    createdAt: z.number(),
  });
  
  const EducationSchema = z.object({
    startDate: z.number(),
    endDate: z.number(),
    degreeName: z.string(),
    schoolName: z.string(),
    description: z.string(),
  });
  
  const WorkExperienceSchema = z.object({
    startDate: z.number(),
    endDate: z.number(),
    roleName: z.string(),
    companyName: z.string(),
    description: z.string(),
  });
  
  const ProfileIPFSSchema = z.object({
    username: z.string(),
    email: z.string(),
    description: z.string(),
    profileType: z.string(),
    country: z.string().optional(),
    reputation: z.array(z.any()).optional(),
    pictureIPFS: z.string().optional(),
    skills: z.array(z.string()).optional(),
    education: z.array(EducationSchema).optional(),
    workExperience: z.array(WorkExperienceSchema).optional(),
    review: z.array(ReviewSchema).optional(),
    preference: z.string().optional()
  });

type ProfileIPFSType = z.infer<typeof ProfileIPFSSchema>;


export { ProfileIPFSSchema, ProfileIPFSType };

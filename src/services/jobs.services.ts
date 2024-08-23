import { ContractAddress, GigBlocksAbi } from "../config/Contracts"
import ViemClient from "../config/ViemClient"
import { getIPFSData } from "../helper/pinata"
import { JobIPFSSchema, JobIPFSType } from "../schema/jobs.schema"

export const getActiveJobs = async (offset :number, limit :number) => {
    const jobs : any = await ViemClient.readContract({
        address: ContractAddress as `0x${string}`,
        abi: GigBlocksAbi,
        functionName: 'getActiveJobs',
        args: [BigInt(offset), BigInt(limit)]
    })

     // Fetch IPFS data for each job
    const jobsWithDetails = await Promise.all(jobs.map(async (job : any) => {
        const jobIpfsData = await getIPFSData(job.jobDetailsIPFS)

        console.log(job)

        return {
          ...job,
          id: Number(job.id),
          payment: Number(job.payment),
          deadline: Number(job.deadline),
          applicantCount: Number(job.applicantCount),
          jobDetails: jobIpfsData
        }
    }))
    
    return jobsWithDetails
}

export const getClientJobs = async (wallet:string, offset :number, limit :number, ) => {
    const jobs : any = await ViemClient.readContract({
        address: ContractAddress as `0x${string}`,
        abi: GigBlocksAbi,
        functionName: 'getClientJobs',
        args: [wallet, BigInt(offset), BigInt(limit)]
    })

     // Fetch IPFS data for each job
    const jobsWithDetails = await Promise.all(jobs.map(async (job : any) => {
        const jobIpfsData = await getIPFSData(job.jobDetailsIPFS)

        return {
          ...job,
          id: Number(job.id),
          payment: Number(job.payment),
          deadline: Number(job.deadline),
          applicantCount: Number(job.applicantCount),
          jobDetails: jobIpfsData
        }
    }))
    
    return jobsWithDetails
}

export const getFreelancerJobs = async (wallet:string, offset :number, limit :number, ) => {
    const jobs : any = await ViemClient.readContract({
        address: ContractAddress as `0x${string}`,
        abi: GigBlocksAbi,
        functionName: 'getFreelancerJobs',
        args: [wallet, BigInt(offset), BigInt(limit)]
    })

     // Fetch IPFS data for each job
    const jobsWithDetails = await Promise.all(jobs.map(async (job : any) => {
        const jobIpfsData = await getIPFSData(job.jobDetailsIPFS)

        return {
          ...job,
          id: Number(job.id),
          payment: Number(job.payment),
          deadline: Number(job.deadline),
          applicantCount: Number(job.applicantCount),
          jobDetails: jobIpfsData
        }
    }))
    
    return jobsWithDetails
}

export const getJobById = async (jobId: number ) => {
    const job : any = await ViemClient.readContract({
        address: ContractAddress as `0x${string}`,
        abi: GigBlocksAbi,
        functionName: 'getJobById',
        args: [BigInt(jobId)]
    })

     // Fetch IPFS data for each job
    const jobIpfsData = await getIPFSData(job.jobDetailsIPFS)

    return {
       ...job,
       id: Number(job.id),
       payment: Number(job.payment),
       deadline: Number(job.deadline),
       applicantCount: Number(job.applicantCount),
       jobDetails: jobIpfsData
    }

}

// export async function fetchAndValidateJobDetail(jobIpfsHash: string): Promise<JobIPFSType> {
//     const data = await getIPFSData(jobIpfsHash);

//     console.log(data, "DATA IPFS")
    
//     const detailJob: JobIPFSType = JobIPFSSchema.parse(data);
    
//     return detailJob;
// }
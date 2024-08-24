import { ContractAddress, GigBlocksAbi, GigBlocksNFTAbi, GigblocksNFTContractAddress } from "../config/Contracts"
import ViemClient from "../config/ViemClient"
import { getIPFSData } from "../helper/pinata"

export const getProfile = async (walletAddress:string) => {
    const profile : any = await ViemClient.readContract({
        address: ContractAddress as `0x${string}`,
        abi: GigBlocksAbi,
        functionName: 'getUserProfile',
        args: [walletAddress]
    })

     // Fetch IPFS data for each job
    const profileDetail = await getIPFSData(profile.profileIPFS)
    
    return {
        ...profile,
        profileDetail : profileDetail,
        totalRating : Number(profile.totalRating),
        ratingCount : Number(profile.ratingCount),
        registrationDate : Number(profile.registrationDate),
        lastRatingIndex : Number(profile.lastRatingIndex)
    }
}

export const getReputation = async (walletAddress:string) => {
    const reputation  : any = await ViemClient.readContract({
        address: ContractAddress as `0x${string}`,
        abi: GigBlocksAbi,
        functionName: 'getReputation',
        args: [walletAddress]
    })

    
    return {
        socialMediaFlags: reputation[0],
        hasENS: reputation[1],
        completedProjects: Number(reputation[2])
    }    
}
import { ContractAddress, GigBlocksAbi } from from "../services/ens.services";
import ViemClient from "../config/ViewClient"
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
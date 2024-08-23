import { FileObject, JsonBody, PinataSDK } from "pinata";


if (!process.env.PINATA_JWT) {
    throw new Error("PINATA_JWT environment variable is not set");
}

if (!process.env.PINATA_GATEWAY) {
    throw new Error("PINATA_GATEWAY environment variable is not set");
}

export const pinataClient = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.PINATA_GATEWAY,
});

// Helper function to fetch IPFS data
export const getIPFSData = async (hash: string) => {
    try {
      const result = await pinataClient.gateways.get(hash)
      return result.data
    } catch (error) {
      console.error('Error fetching IPFS data:', error)
      return null
    }
}

export const uploadJsonIPFS = async (data : JsonBody) => {
    try {
        const result = await pinataClient.upload.json(data)
        return result
    } catch (error) {
        console.error('Error upload IPFS data:', error)
        return null
    }
}

export const uploadFileIPFS = async (data : FileObject) => {
    try {
        const result = await pinataClient.upload.file(data)
        return result
    } catch (error) {
        console.error('Error upload IPFS data:', error)
        return null
    }
}

export const removeIPFS = async (arrayhash : string[]) => {
    try {
        const unpin = await pinataClient.unpin(arrayhash)
        return unpin
    } catch (error) {
        console.error('Error Unpin IPFS data:', error)
        return null
    }
}
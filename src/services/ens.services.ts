import { Address, getAddress } from "viem";
import {
  ENS_REGISTRY_ADDRESS,
  ENS_ADDRESS_RESOLVER,
  ENS_ABI,
} from "../config/Contracts";
import ViemClient from "../config/ViewClient";

export const getENS = async (ensName: string): Promise<Address | null> => {
  try {
    // Resolve ENS name to Ethereum address
    const address = await ViemClient.getEnsAddress({
      name: ensName,
    });

    if (!address) {
      return null;
    }

    const checksumAddress = getAddress(address);
    console.log(`Resolved ${ensName} to ${checksumAddress}`);
    return checksumAddress;
  } catch (error) {
    console.error("Error resolving ENS name:", error);
    throw error;
  }
};

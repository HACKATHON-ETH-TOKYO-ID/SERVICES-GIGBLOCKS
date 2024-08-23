import { Address, getAddress, getContract, encodePacked, keccak256 } from "viem";
import {
  ENS_REGISTRY_ADDRESS,
  ENS_ADDRESS_RESOLVER,
  ENS_ABI,
} from "../config/Contracts";
import EnsClient from "../config/EnsClient";
import EnsWalletClient from "../config/EnsWalletClient";

export const getENS = async (ensName: string): Promise<Address | null> => {
  try {
    // Resolve ENS name to Ethereum address
    const address = await EnsClient.getEnsAddress({
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

export const createSubEns = async (
  subdomainName: string,
  givenSubdomainAddress: `0x${string}`,
  parentDomain: string = "gigblocks.eth"
) => {
  try {
    // Resolve parent domain
    const parentAddress = await getENS(parentDomain);
    if (!parentAddress) {
      throw new Error(`Could not resolve parent domain ${parentDomain}`);
    }

    // Check if subdomain already exists
    const subDomainaddressOwner = await getENS(
      `${subdomainName}.${parentDomain}`
    );
    if (subDomainaddressOwner) {
      throw new Error(
        `Subdomain ${subdomainName}.${parentDomain} already exists`
      );
    }

    // Get the ENS registry contract
    const registryContract = getContract({
      address: ENS_REGISTRY_ADDRESS,
      abi: ENS_ABI,
      client: EnsWalletClient,
    });

    // Calculate the namehash of the parent domain
    const parentNamehash = namehash(parentDomain);

    // Calculate the label hash of the subdomain
    const labelHash = keccak256(encodePacked(["string"], [subdomainName]));

    // Set the subdomain record
    const tx = await registryContract.write.setSubnodeRecord([
      parentNamehash,
      labelHash,
      givenSubdomainAddress,
      ENS_ADDRESS_RESOLVER,
      BigInt(0), // TTL, set to 0 for now
    ]);

    // Wait for the transaction to be mined
    const receipt = await EnsClient.waitForTransactionReceipt({
      hash: tx,
    });

    return {
      transactionHash: receipt.transactionHash,
      subdomainName: `${subdomainName}.${parentDomain}`,
      owner: givenSubdomainAddress,
    };
  } catch (error) {
    console.error("Error creating subdomain:", error);
    throw error;
  }
};

// Helper function to calculate namehash
function namehash(name: string): string {
  let node =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  if (name) {
    const labels = name.split(".");
    for (let i = labels.length - 1; i >= 0; i--) {
      node = keccak256(
        encodePacked(
          ["bytes32", "bytes32"],
          [node as `0x${string}`, keccak256(encodePacked(["string"], [labels[i]]))]
        )
      );
    }
  }
  return node;
}

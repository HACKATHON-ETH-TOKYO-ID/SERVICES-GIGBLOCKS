import {
  Address,
  formatEther,
  getAddress,
  getContract,
  encodePacked,
  keccak256,
} from "viem";
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
    const parentAddress = await getENS(parentDomain);
    if (!parentAddress) {
      throw new Error(`Could not resolve ${parentDomain}`);
    }
    const subDomainaddressOwner = await getENS(subdomainName);
    if (subDomainaddressOwner) {
      throw new Error(`Subdomain ${subdomainName} already exists`);
    }
    // Get the ENS registry contract
    const registryContract = getContract({
      address: ENS_REGISTRY_ADDRESS,
      abi: ENS_ABI,
      client: EnsWalletClient,
    });

    // Calculate the namehash of the parent domain
    const parentNamehash = namehash(parentDomain);

    const txSubnodeRecordParams = [
      parentNamehash,
      subdomainName,
      givenSubdomainAddress,
      ENS_ADDRESS_RESOLVER,
      BigInt(0),
      0, // Fuses
      BigInt(0), // Expiry
    ];

    const txSubnodeRecord = await createTransactionSubnodeRecord(
      registryContract,
      txSubnodeRecordParams
    );

    const receiptRecord = await waitForTransactionWithRetry(txSubnodeRecord);

    const formatGasData = (receipt: any) => ({
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: formatEther(receipt.effectiveGasPrice),
      totalGasCost: formatEther(
        BigInt(receipt.gasUsed) * receipt.effectiveGasPrice
      ),
    });

    const recordGasData = formatGasData(receiptRecord);

    return {
      ens: `${subdomainName}.${parentDomain}`,
      owner: givenSubdomainAddress,
      transactions: {
        setSubnodeRecord: {
          hash: txSubnodeRecord,
          ...recordGasData,
        },
      },
    };
  } catch (error) {
    console.error("Error creating subdomain:", error);
    throw error;
  }
};

const waitForTransactionWithRetry = async (
  hash: `0x${string}`,
  maxAttempts = 5,
  delayMs = 5000
) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const receipt = await EnsClient.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      console.log(
        `Attempt ${attempt} failed. Retrying in ${delayMs / 1000} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

async function createTransactionSubnodeRecord(
  registryContract: any,
  txParams: any
) {
  try {
    const tx = await registryContract.write.setSubnodeRecord(txParams);
    return tx;
  } catch (error) {
    console.error("Error creating createTransactionSubnodeRecord:", error);
    throw error;
  }
}

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
          [
            node as `0x${string}`,
            keccak256(encodePacked(["string"], [labels[i]])),
          ]
        )
      );
    }
  }
  return node;
}

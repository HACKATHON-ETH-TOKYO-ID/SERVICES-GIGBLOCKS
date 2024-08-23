import { createPublicClient, http } from "viem"
import { scrollSepolia } from 'viem/chains'


const ViemClient = createPublicClient({
  chain: scrollSepolia,
  transport: http(process.env.SCROLL_SEPOLIA_RPC_URL)
})


export default ViemClient
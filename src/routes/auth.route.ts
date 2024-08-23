import { Hono } from 'hono'
import { getAccessTokenFromCode } from '../services/auth.services';
import {ethers}  from 'ethers';

const auth = new Hono()
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
    
const wallet = new ethers.Wallet(PRIVATE_KEY);

auth.post('/github', async (c) => {
    const body = await c.req.json()
    
    const githubAccessToken : string = await getAccessTokenFromCode(body.code);

    if(!githubAccessToken){
        throw Error("Github Access Token Error!")
    }


    console.log(githubAccessToken, "ACCESS TOKEN")
     // Create the message hash
    const messageHash = ethers.solidityPackedKeccak256(
        ['address', 'string'],
        [body.walletAddress, 'github']
    );

    // Create the EthereumSignedMessage
    const ethSignedMessageHash = ethers.hashMessage(ethers.toBeArray(messageHash));

    // Sign the message
    const signature = await wallet.signMessage(ethers.toBeArray(messageHash));

    console.log('Message Hash:', messageHash)

    console.log('Signature:', signature);

    return c.json({ messageHash, signature });
})

export default auth
import axios from "axios";
import { ethers } from "ethers";
import queryString from 'query-string';

const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
    
const wallet = new ethers.Wallet(PRIVATE_KEY);

export const getAccessTokenFromCode = async (code : string) => {
    const { data } = await axios({
      url: 'https://github.com/login/oauth/access_token',
      method: 'get',
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        redirect_uri: process.env.GITHUB_REDIRECT,
        code,
      },
    });
    /**
     * GitHub returns data as a string we must parse.
     */
    const parsedData = queryString.parse(data);

    if (parsedData.error) throw Error(String(parsedData.error_description))

    return String(parsedData.access_token);
};

export const getAccessTokenLinkedin = async (code : string) => {
    const { data } = await axios
    .post("https://www.linkedin.com/oauth/v2/accessToken", queryString.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.LINKEDIN_REDIRECT,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET
    }));

    return String(data.access_token);
};

export const generateSignature = async (walletAddress : string, platform : string) => {
    // Create the message hash
    const messageHash = ethers.solidityPackedKeccak256(
        ['address', 'string'],
        [walletAddress, platform]
    );

    // Sign the message
    const signature = await wallet.signMessage(ethers.toBeArray(messageHash));

    return {messageHash, signature}
}
import axios from "axios";
import queryString from 'query-string';


export const getAccessTokenFromCode = async (code : string) => {
    const { data } = await axios({
      url: 'https://github.com/login/oauth/access_token',
      method: 'get',
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/profile',
        code,
      },
    });
    /**
     * GitHub returns data as a string we must parse.
     */
    const parsedData = queryString.parse(data);
    console.log(parsedData); 

    return parsedData.access_token;
};
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

    if (parsedData.error) throw Error(String(parsedData.error_description))

    return String(parsedData.access_token);
};

export const getGitHubUserData = async (access_token : string) => {
    const { data } = await axios({
      url: 'https://api.github.com/user',
      method: 'get',
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    console.log(data); // { id, email, name, login, avatar_url }
    return data;
  };
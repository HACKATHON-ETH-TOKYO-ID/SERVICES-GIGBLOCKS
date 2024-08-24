import { Hono } from 'hono'
import { StreamChat } from 'stream-chat'

const chat = new Hono()

const API_KEY = process.env.STREAM_API_KEY as string;
const API_SECRET = process.env.STREAM_API_SECRET as string;

if (!API_KEY || !API_SECRET) {
  console.error("Stream API key or secret is missing!");
  process.exit(1);
}

const serverClient = StreamChat.getInstance(API_KEY, API_SECRET);

chat.post('/token', async (c) => {
  const { userId, userName } = await c.req.json();
  console.log("Received token request for userId:", userId, "userName:", userName);

  if (!userId || !userName) {
    console.error("Missing userId or userName");
    return c.json({ error: 'userId and userName are required' }, 400);
  }

  try {
    console.log("Generating token for userId:", userId);
    const token = serverClient.createToken(userId.toString());
    console.log("Generated token:", token);
    
    // Log token details
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    console.log("Decoded token payload:", decodedToken);
    
    return c.json({ token });
  } catch (error:any) {
    console.error('Error generating token:', error);
    return c.json({ error: 'Failed to generate token', details: error.message }, 500);
  }
});

chat.post('/create-channel', async (c) => {
  const { userId, otherUserId } = await c.req.json();
  
  if (!userId || !otherUserId) {
    return c.json({ error: 'Both user IDs are required' }, 400);
  }

  try {
    const channelId = [userId, otherUserId].sort().join('-');
    const channel = serverClient.channel('messaging', channelId, {
      members: [userId, otherUserId],
    });

    await channel.create();
    console.log("Channel created:", channelId);

    return c.json({ channelId });
  } catch (error: any) {
    console.error('Error creating channel:', error);
    return c.json({ error: 'Failed to create channel', details: error.message }, 500);
  }
});

export default chat;
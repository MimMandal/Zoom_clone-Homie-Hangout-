'use server';

import { auth } from '@clerk/nextjs/server';
import { StreamClient } from '@stream-io/node-sdk';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const { userId } = await auth();

  if (!userId) throw new Error('User is not authenticated');
  if (!STREAM_API_KEY) throw new Error('Stream API key secret is missing');
  if (!STREAM_API_SECRET) throw new Error('Stream API secret is missing');

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);

  const now = Math.floor(Date.now() / 1000);
  const expirationTime = now + 3600;
  const issuedAt = now - 600; // 10-minute buffer for clock skew

  const token = streamClient.createToken(userId, expirationTime, issuedAt);

  return token;
};

import { createClient, SchemaFieldTypes } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PWD
});

client.connect();

export const addWinner = () => {
  const day = new Date().toISOString().split('T')[0];
  client.hIncrBy(day, 'winners', 1);
};

export const getWinners = async () => {
  try {
    const day = new Date().toISOString().split('T')[0];
    const winners = await client.hGet(day, 'winners');
    return Number(winners);
  } catch {
    return 0;
  }
};

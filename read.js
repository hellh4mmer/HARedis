import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const client = createClient({
    sentinels: [
      { host: process.env.SENTINEL_HOST, port: process.env.SENTINEL_PORT_1 },
      { host: process.env.SENTINEL_HOST, port: process.env.SENTINEL_PORT_2 },
      { host: process.env.SENTINEL_HOST, port: process.env.SENTINEL_PORT_3 },
    ],
    name: process.env.REDIS_CLUSTER_NAME,
    username: process.env.REDIS_READONLY_USER,
    password: process.env.REDIS_READONLY_PASSWORD,
  });

  client.on('error', (err) => console.log('Redis Client Error:', err));
  client.on('connect', () =>
    console.log('Connected to Redis master via Sentinel')
  );

  await client.connect();

  try {
    const keys = await client.keys('*');
    console.log('Keys:', keys);
  } catch (error) {
    console.log('Error:', error);
  }

  await client.disconnect();
  console.log('Disconnected from Redis master via Sentinel');
}

main();

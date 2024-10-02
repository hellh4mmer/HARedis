import { createClient } from 'redis';
import { faker } from '@faker-js/faker';
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
    password: process.env.REDIS_MASTER_PASSWORD,
  });

  client.on('error', (err) => console.log('Redis Client Error:', err));
  client.on('connect', () =>
    console.log('Connected to Redis master via Sentinel')
  );

  await client.connect();

  for (let i = 0; i < 50; i++) {
    try {
      const name = faker.person.fullName();
      console.log('inserting:', name);
      await client.set(`nama${i}`, name);
    } catch (error) {
      console.log('Error:', error);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  await client.disconnect();
  console.log('Disconnected from Redis master via Sentinel');
}

main();

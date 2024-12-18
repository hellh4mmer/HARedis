import { Redis } from 'ioredis';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const ioclient = new Redis({
    sentinels: [
      { host: process.env.SENTINEL_HOST, port: process.env.SENTINEL_PORT_1 },
      { host: process.env.SENTINEL_HOST, port: process.env.SENTINEL_PORT_2 },
      // { host: process.env.SENTINEL_HOST, port: process.env.SENTINEL_PORT_3 },
    ],
    name: 'mymaster',
    // password: 'Complex-Password-Goes-Here',
    // sentinelPassword: 'sentinelPassword',
    // sentinelRetryStrategy: function (times) {
    //   // reconnect after
    //   return Math.max(times * 100, 3000);
    // },
  });

  ioclient.on('connect', async () => {
    const info = await ioclient.info();
    console.log(info);
  });

  for (let i = 0; i < 50; i++) {
    try {
      const name = faker.person.fullName();
      console.log('inserting:', name);
      await ioclient.set(`nama${i}`, name);
    } catch (error) {
      console.log('Error:', error);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  ioclient.disconnect();
  console.log('Disconnected from Redis master via Sentinel');
}

main();

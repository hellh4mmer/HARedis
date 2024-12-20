import { Redis } from 'ioredis';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const ioclient = new Redis({
    sentinels: [
      { host: process.env.HOST_IP, port: process.env.SENTINEL_PORT_1 },
      { host: process.env.HOST_IP, port: process.env.SENTINEL_PORT_2 },
      // { host: process.env.HOST_IP, port: process.env.SENTINEL_PORT_3 },
    ],
    name: process.env.REDIS_CLUSTER_NAME,
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
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  ioclient.on('close', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Writing Done');
  });

  ioclient.on('end', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Disconnected from Redis master via Sentinel');
  });

  for (let i = 0; i < 5; i++) {
    try {
      const name = faker.person.fullName();
      await ioclient.set(`nama${i}`, name);
      console.log('inserted:', name);
    } catch (error) {
      console.log('Error:', error);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  ioclient.disconnect();
}

main();

import { Redis } from 'ioredis';
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
  });

  try {
    const randomKey = await ioclient.randomkey();
    if (!randomKey) {
      console.log('No keys found');
    } else {
      const randomValue = await ioclient.get(randomKey);
      const keysCount = await ioclient.dbsize();
      console.log('Random key:', randomKey);
      console.log('Random value:', randomValue);
      console.log('Keys count:', keysCount);
    }
  } catch (error) {
    console.log('Error:', error);
  }

  ioclient.disconnect();
  console.log('Disconnected from Redis master via Sentinel');
}

main();

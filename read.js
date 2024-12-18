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

  ioclient.on('close', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Reading Done');
  });

  ioclient.on('end', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Disconnected from Redis master via Sentinel');
  });

  try {
    const keys = await ioclient.keys('*');
    console.log('Keys:', keys);
  } catch (error) {
    console.log('Error:', error);
  }

  ioclient.disconnect();
}

main();

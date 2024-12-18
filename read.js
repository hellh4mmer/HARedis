import { Redis } from 'ioredis';
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

  try {
    const keys = await ioclient.keys('*');
    console.log('Keys:', keys);
  } catch (error) {
    console.log('Error:', error);
  }

  ioclient.disconnect();
  console.log('Disconnected from Redis master via Sentinel');
}

main();

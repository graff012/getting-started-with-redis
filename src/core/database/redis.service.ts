import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export default class RedisService {
  private redis: Redis;
  private duration: number = 180;
  constructor() {
    this.redis = new Redis({
      port: +(process.env.REDIS_PORT as string),
      host: process.env.REDIS_HOST as string,
    });
    this.redis.on('connect', () => console.log('Redis connected'));
    this.redis.on('error', (err) => {
      console.log('Error occured while connecting to redis: ', err);
      this.redis.quit();
    });
  }

  async setOtp(phoneNumber: string, value: string): Promise<string> {
    const key = `users:${phoneNumber}`;
    const res = await this.redis.setex(key, this.duration, value);
    return res;
  }
}

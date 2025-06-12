import { Injectable } from '@nestjs/common';
import { generate } from 'otp-generator';
import RedisService from 'src/core/database/redis.service';

@Injectable()
export class OtpService {
  constructor(private readonly redisService: RedisService) {}
  private generateOtp() {
    const otp = generate(4, {
      digits: true,
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    return otp;
  }

  async sendOtp(phoneNumber: string) {
    const tempOtp = this.generateOtp();
    const resRedis = await this.redisService.setOtp(phoneNumber, tempOtp);
    console.log(resRedis);
  }
}

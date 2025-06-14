import { BadRequestException, Injectable } from '@nestjs/common';
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
    await this.checkOtpExisting(`user:${phoneNumber}`);
    const tempOtp = this.generateOtp();
    const resRedis = await this.redisService.setOtp(phoneNumber, tempOtp);
    if (resRedis === 'OK') {
      return true;
    }
  }

  async checkOtpExisting(key: string) {
    console.log(key);
    const checkOtp = await this.redisService.getOtp(key);
    if (checkOtp) {
      const ttl = await this.redisService.getTtlKey(key);
      throw new BadRequestException(`Please try again after ${ttl} seconds`);
    }
  }

  async verifyOtpSendedUser(key: string, code: string) {
    const otp = await this.redisService.getOtp(key);
    if (!otp || otp !== code) throw new BadRequestException('Invalid code');

    await this.redisService.delKey(key);
  }
}

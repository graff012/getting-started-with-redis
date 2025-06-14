import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import bcrypt from 'bcrypt';
import { OtpService } from './otp.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService
  ) {}

  async sendOtpUser(registerDAta: CreateAuthDto) {
    const findUser = await this.prismaService.user.findFirst({
      where: { phoneNumber: registerDAta.phoneNumber },
    });

    if (findUser) throw new ConflictException('phone number already exists');

    const phoneNumber = registerDAta.phoneNumber;
    const res = await this.otpService.sendOtp(phoneNumber);
    if (!res) throw new InternalServerErrorException('Server error');

    return {
      message: 'code sended',
    };
  }

  async verifyOtp(verifyData: VerifyOtpDto) {
    const key = `user:${verifyData.phoneNumber}`;
    await this.otpService.verifyOtpSendedUser(key, verifyData.code);

    return {
      message: 'success',
      statusCode: 200,
    };
  }

  async register(registerData: CreateAuthDto) {
    const findUser = await this.prismaService.user.findFirst({
      where: { phoneNumber: registerData.phoneNumber },
    });

    if (findUser) throw new ConflictException('phone number already exists');

    const hashedPass = await bcrypt.hash(registerData.password, 12);

    // const newUser = await this.prismaService.user.create({
    //   data: {
    //     phoneNumber,
    //     password: hashedPass,
    //   },
    // });
    //
    // const token = this.jwtService.signAsync({ userId: newUser.id });
    //
    // return token;
  }
}

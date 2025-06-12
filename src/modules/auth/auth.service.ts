import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import bcrypt from 'bcrypt';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService
  ) {}

  async register(registerDAta: CreateAuthDto) {
    const findUser = await this.prismaService.user.findFirst({
      where: { phoneNumber: registerDAta.phoneNumber },
    });

    if (findUser) throw new ConflictException('phone number already exists');

    const phoneNumber = registerDAta.phoneNumber;
    await this.otpService.sendOtp(phoneNumber);

    const hashedPass = await bcrypt.hash(registerDAta.password, 12);

    // const newUser = await this.prismaService.user.create({
    //   data: {
    //     phoneNumber,
    //     password: hashedPass,
    //   },
    // });

    // const token = this.jwtService.signAsync({ userId: newUser.id });
    //
    // return token;
  }
  async login() {}
}

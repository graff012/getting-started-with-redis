import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtpUser(
    @Body() data: CreateAuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.authService.sendOtpUser(data);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1.1 * 3600 * 1000,
    });

    return token;
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const res = await this.authService.verifyOtp(verifyOtpDto);
    return res;
  }

  @Post('register')
  async register(
    @Body() data: CreateAuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.authService.register(data);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1.1 * 3600 * 1000,
    });

    return token;
  }
}

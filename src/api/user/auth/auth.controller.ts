import {
  Body,
  Controller,
  Inject,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import UserEntity from '../user.entity';
import { SignUpDto, SognInDto } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: SignUpDto): Promise<UserEntity | never> {
    return this.service.signUp(body);
  }

  @Post('signin')
  public async login(@Body() body: SognInDto): Promise<string> {
    const token = await this.service.signIn(body);
    return token;
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  private refresh(@Req() { user }: Request): Promise<string | never> {
    return this.service.refresh(<UserEntity>user);
  }
}

export default AuthController;

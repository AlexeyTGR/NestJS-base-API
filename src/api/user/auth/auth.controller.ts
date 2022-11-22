import { Body, Controller, Inject, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

import UserEntity from '../user.entity';
import { SignUpDto, SignInDto } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthService, AuthResponseType } from './auth.service';
import { SignInDecorator, SignUpDecorator } from './auth.decorator';

@Controller('auth')
class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @SignUpDecorator()
  @Post('signup')
  public signup(@Body() body: SignUpDto): Promise<AuthResponseType | never> {
    return this.service.signUp(body);
  }

  @SignInDecorator()
  @Post('signin')
  public async login(@Body() body: SignInDto): Promise<AuthResponseType> {
    const { token, user } = await this.service.signIn(body);
    return { token, user };
  }

  @ApiTags('auth group')
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  public refresh(@Req() { user }: Request): Promise<string | never> {
    return this.service.refresh(<UserEntity>user);
  }
}

export default AuthController;

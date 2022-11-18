import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import AuthController from './auth.controller';
import AuthHelper from './auth.helper';
import { AuthService } from './auth.service';
import JwtStrategy from './auth.strategy';
import UserEntity from '../user.entity';
import { RolesGuard } from './role/role.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('TOKEN_SECRET_KEY'),
        signOptions: { expiresIn: config.get('TOKEN_EXPIRES') },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthHelper,
    JwtStrategy,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}

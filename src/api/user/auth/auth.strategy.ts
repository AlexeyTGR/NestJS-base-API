import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import UserEntity from '../user.entity';
import AuthHelper from './auth.helper';

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('TOKEN_SECRET_KEY'),
      ignoreExpiration: true,
    });
  }

  public validate(payload: string): Promise<UserEntity | never> {
    return this.helper.validateUser(payload);
  }
}

export default JwtStrategy;

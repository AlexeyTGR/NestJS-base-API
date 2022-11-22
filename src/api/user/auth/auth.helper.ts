import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import UserEntity from '../user.entity';

@Injectable()
class AuthHelper {
  @InjectRepository(UserEntity)
  private readonly repository: Repository<UserEntity>;

  private readonly jwt: JwtService;

  constructor(jwt: JwtService) {
    this.jwt = jwt;
  }

  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  public async validateUser(decoded: any): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { id: decoded.id } });
    if (!user) {
      throw new HttpException(
        'Authorization error. User is not found',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  public generateToken(user: UserEntity): string {
    return this.jwt.sign({ id: user.id, email: user.email });
  }

  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  private async validate(token: string): Promise<boolean | never> {
    const decoded: unknown = this.jwt.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: UserEntity = await this.validateUser(decoded);

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}

export default AuthHelper;

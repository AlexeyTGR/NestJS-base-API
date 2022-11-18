import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserEntity from '../user.entity';
import { SignUpDto, SognInDto } from './auth.dto';
import AuthHelper from './auth.helper';

@Injectable()
export class AuthService {
  @InjectRepository(UserEntity)
  private readonly repository: Repository<UserEntity>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async signUp(body: SignUpDto): Promise<UserEntity | never> {
    const { name, email, password }: SignUpDto = body;
    let user: UserEntity = await this.repository.findOneBy({ email });

    if (user) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }

    user = new UserEntity();

    user.name = name;
    user.email = email;
    user.password = this.helper.encodePassword(password);

    return this.repository.save(user);
  }

  public async signIn(body: SognInDto): Promise<string | never> {
    const { email, password }: SognInDto = body;
    const user: UserEntity = await this.repository.findOne({
      where: {
        email: email,
      },
      select: {
        password: true,
      },
    });

    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = this.helper.isPasswordValid(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    return this.helper.generateToken(user);
  }

  public async refresh(user: UserEntity): Promise<string> {
    return this.helper.generateToken(user);
  }
}

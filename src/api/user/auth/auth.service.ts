import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserEntity from '../user.entity';
import { SignUpDto, SignInDto } from './auth.dto';
import AuthHelper from './auth.helper';

export type AuthResponseType = {
  token: string;
  user: UserEntity;
};

@Injectable()
export class AuthService {
  @InjectRepository(UserEntity)
  private readonly repository: Repository<UserEntity>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async signUp(body: SignUpDto): Promise<AuthResponseType | never> {
    const { name, email, password }: SignUpDto = body;
    let user: UserEntity = await this.repository.findOneBy({ email });

    if (user) {
      throw new HttpException(
        'This email is already taken',
        HttpStatus.CONFLICT,
      );
    }

    user = new UserEntity();

    user.name = name;
    user.email = email;
    user.password = this.helper.encodePassword(password);

    const createdUser = await this.repository.save(user);
    if (!createdUser) {
      throw new HttpException(
        'An error occurred while creating a new user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const token = this.helper.generateToken(createdUser);

    return { user: createdUser, token };
  }

  public async signIn(body: SignInDto): Promise<AuthResponseType | never> {
    const { email, password }: SignInDto = body;
    const foundUser: UserEntity = await this.repository.findOne({
      where: {
        email: email,
      },
      select: {
        password: true,
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!foundUser) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = this.helper.isPasswordValid(
      password,
      foundUser.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const token = this.helper.generateToken(foundUser);

    const user = { ...foundUser } as UserEntity;
    delete user.password;

    return { token, user };
  }

  public async refresh(user: UserEntity): Promise<string> {
    return this.helper.generateToken(user);
  }
}

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import UserEntity from './user.entity';
import AuthHelper from './auth/auth.helper';

@Injectable()
class UserService {
  @InjectRepository(UserEntity)
  private readonly repository: Repository<UserEntity>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async getUser(id: number): Promise<UserEntity> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async getAllUsers(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  public async createUser(body: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();

    user.name = body.name;
    user.email = body.email;
    user.password = body.password;

    return this.repository.save(user);
  }

  public async update(body: UpdateUserDto, id: number): Promise<UserEntity> {
    const user = await this.repository.findOne({
      where: { id },
      select: {
        password: true,
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    if (body.name) {
      user.name = body.name;
    }

    if (body.password && !body.newPassword) {
      throw new HttpException(
        'Not enough data to change password',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.newPassword) {
      if (!body.password) {
        throw new HttpException(
          'Not enough data to change password',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isPasswordValid: boolean = this.helper.isPasswordValid(
        body.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
      }

      user.password = this.helper.encodePassword(body.newPassword);
    }

    if (body.email) {
      const userWithThisEmail = await this.repository.findOne({
        where: { email: body.email },
      });
      if (userWithThisEmail) {
        throw new HttpException(
          'This email is already taken',
          HttpStatus.CONFLICT,
        );
      }

      user.email = body.email;
    }

    const updatedUser = await this.repository.save(user);
    delete updatedUser.password;

    return updatedUser;
  }

  public async deleteUser(id: number): Promise<DeleteResult> {
    const deletedUser = await this.repository.delete(id);

    return deletedUser;
  }
}

export default UserService;

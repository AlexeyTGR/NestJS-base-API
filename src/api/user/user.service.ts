import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Request } from 'express';
import { CreateUserDto, UpdateNameDto } from './user.dto';
import UserEntity from './user.entity';

@Injectable()
class UserService {
  @InjectRepository(UserEntity)
  private readonly repository: Repository<UserEntity>;

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

  public async updateName(
    body: UpdateNameDto,
    id: number,
  ): Promise<UserEntity> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    }
    user.name = body.name;

    return this.repository.save(user);
  }

  public async deleteUser(id: number): Promise<DeleteResult> {
    const deletedUser = await this.repository.delete(id);

    return deletedUser;
  }
}

export default UserService;

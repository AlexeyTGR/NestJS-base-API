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
    return this.repository.findOneBy({ id });
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
    req: Request,
  ): Promise<UserEntity> {
    const user: UserEntity = <UserEntity>req.user;
    user.name = body.name;

    return this.repository.save(user);
  }

  public async deleteUser(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }
}

export default UserService;

import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';

import UserEntity from './user.entity';
import { UpdateUserDto } from './user.dto';
import UserService from './user.service';
import {
  DeleteUserDecorator,
  GetAllUsersDecorator,
  GetUserDecorator,
  UpdateUserDecorator,
} from './user.decorators';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @GetUserDecorator()
  @Get(':id')
  public async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserEntity> {
    const user = await this.service.getUser(id);

    return user;
  }

  @GetAllUsersDecorator()
  @Get()
  public async getAllUsers(): Promise<UserEntity[]> {
    const users = await this.service.getAllUsers();
    return users;
  }

  @UpdateUserDecorator()
  @Patch(':id')
  public update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.service.update(body, id);
  }

  @DeleteUserDecorator()
  @Delete(':id')
  public deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.service.deleteUser(id);
    return;
  }
}

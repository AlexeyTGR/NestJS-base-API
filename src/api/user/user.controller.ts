import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';

import UserEntity from './user.entity';
import { CreateUserDto, UpdateNameDto } from './user.dto';
import UserService from './user.service';
import { JwtAuthGuard } from './auth/auth.guard';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserEntity> {
    const user = await this.service.getUser(id);

    if (!user) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Get()
  public getAllUsers(): Promise<UserEntity[]> {
    return this.service.getAllUsers();
  }

  @Post()
  public async createUser(@Body() body: CreateUserDto): Promise<UserEntity> {
    const user = await this.service.createUser(body);

    return user;
  }

  @Put('name')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  public updateName(
    @Body() body: UpdateNameDto,
    @Req() req: Request,
  ): Promise<UserEntity> {
    return this.service.updateName(body, req);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.service.deleteUser(id);
    return;
  }
}

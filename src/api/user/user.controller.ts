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
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import UserEntity from './user.entity';
import { UpdateNameDto } from './user.dto';
import UserService from './user.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { UserRoleEnum } from './auth/role/role.types';
import { Roles } from './auth/role/role.decorator';
import swaggerExamples from './helpers/swaggerExamples';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @ApiTags('User group')
  @ApiOperation({ description: 'Get user by user ID, authorized only' })
  @ApiResponse({
    schema: swaggerExamples.createStandartUserResponseSchema(),
    status: 200,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User is not found',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  public async getUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserEntity> {
    const user = await this.service.getUser(id);

    if (!user) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @ApiTags('User group')
  @ApiOperation({ description: 'Get all users, authorized only' })
  @ApiResponse({
    schema: swaggerExamples.createStandartUserResponseSchema(false, true),
    status: 200,
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  public async getAllUsers(): Promise<UserEntity[]> {
    const users = await this.service.getAllUsers();
    return users;
  }

  @ApiTags('User group')
  @ApiOperation({ description: 'Update user name by user ID, admin only' })
  @ApiBody({
    schema: {
      properties: {
        name: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      properties: {
        users: {
          example: swaggerExamples.USER_SCHEMA,
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoleEnum.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    schema: swaggerExamples.createStandartUserResponseSchema(),
    status: 200,
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User is not found',
  })
  @Patch(':id')
  public updateName(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateNameDto,
  ): Promise<UserEntity> {
    return this.service.updateName(body, id);
  }

  @ApiTags('User group')
  @ApiOperation({ description: 'Delete user by user ID, admin only' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRoleEnum.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.service.deleteUser(id);
    return;
  }
}

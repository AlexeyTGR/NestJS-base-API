import {
  applyDecorators,
  HttpCode,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from './auth/auth.guard';
import { Roles } from './auth/role/role.decorator';
import { UserRoleEnum } from './auth/role/role.types';
import swaggerExamples from './helpers/swaggerExamples';

export const GetUserDecorator = () => {
  return applyDecorators(
    ApiTags('User group'),
    ApiOperation({ description: 'Get user by user ID, authorized only' }),
    ApiResponse({
      schema: swaggerExamples.createStandartUserResponseSchema(),
      status: 200,
    }),
    ApiNotFoundResponse({
      status: 404,
      description: 'User is not found',
    }),
    UseGuards(JwtAuthGuard),
    UseInterceptors(ClassSerializerInterceptor),
  );
};

export const GetAllUsersDecorator = () => {
  return applyDecorators(
    ApiTags('User group'),
    ApiOperation({ description: 'Get all users, authorized only' }),
    ApiResponse({
      schema: swaggerExamples.createStandartUserResponseSchema(false, true),
      status: 200,
    }),
    UseGuards(JwtAuthGuard),
    UseInterceptors(ClassSerializerInterceptor),
  );
};

export const UpdateUserDecorator = () => {
  return applyDecorators(
    ApiTags('User group'),
    ApiOperation({ description: 'Update user data by user ID, admin only' }),
    ApiBody({
      schema: {
        properties: {
          name: {
            type: 'string',
          },
          email: {
            type: 'email',
          },
          password: {
            type: 'string',
          },
          newPassword: {
            type: 'string',
          },
        },
      },
    }),
    ApiResponse({
      schema: {
        properties: {
          users: {
            example: swaggerExamples.USER_SCHEMA,
          },
        },
      },
    }),
    UseGuards(JwtAuthGuard),
    Roles(UserRoleEnum.ADMIN),
    UseInterceptors(ClassSerializerInterceptor),
    ApiResponse({
      schema: swaggerExamples.createStandartUserResponseSchema(),
      status: 200,
    }),
    ApiNotFoundResponse({
      description: 'User is not found',
    }),
    ApiBadRequestResponse({
      description: 'Not enough data to change password',
    }),
    ApiForbiddenResponse({
      description: 'Invalid password',
    }),
    ApiConflictResponse({
      description: 'This email is already taken',
    }),
  );
};

export const DeleteUserDecorator = () => {
  return applyDecorators(
    ApiTags('User group'),
    ApiOperation({ description: 'Delete user by user ID, admin only' }),
    UseGuards(JwtAuthGuard),
    UseInterceptors(ClassSerializerInterceptor),
    Roles(UserRoleEnum.ADMIN),
    HttpCode(HttpStatus.NO_CONTENT),
  );
};

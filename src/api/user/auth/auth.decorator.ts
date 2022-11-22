import {
  applyDecorators,
  HttpCode,
  ClassSerializerInterceptor,
  UseInterceptors,
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
} from '@nestjs/swagger';
import swaggerExamples from '../helpers/swaggerExamples';

export const SignInDecorator = () => {
  return applyDecorators(
    ApiOperation({ description: 'This is the Sign In Endpoint.' }),
    ApiTags('auth group'),
    ApiBody({
      schema: {
        properties: {
          email: {
            format: 'email',
          },
          password: {
            type: 'string',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      schema: {
        properties: {
          token: {
            type: 'string',
          },
          user: {
            example: swaggerExamples.USER_SCHEMA,
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'User with this email is not found',
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid password',
    }),
    HttpCode(200),
  );
};

export const SignUpDecorator = () => {
  return applyDecorators(
    ApiTags('auth group'),
    ApiOperation({
      description:
        'Send a unique email address, password (minimum length 2) and name to register a new user.',
    }),
    ApiBody({
      schema: {
        properties: {
          email: {
            format: 'email',
          },
          password: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      schema: {
        properties: {
          token: {
            type: 'string',
          },
          user: {
            example: swaggerExamples.USER_SCHEMA,
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Password must be longer than or equal to 2 characters',
    }),
    ApiConflictResponse({
      description: 'This email is already taken',
    }),
    UseInterceptors(ClassSerializerInterceptor),
  );
};

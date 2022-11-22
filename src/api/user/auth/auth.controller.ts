import {
  Body,
  Controller,
  Inject,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
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

import UserEntity from '../user.entity';
import { SignUpDto, SignInDto } from './auth.dto';
import { JwtAuthGuard } from './auth.guard';
import { AuthService, AuthResponseType } from './auth.service';
import swaggerExamples from '../helpers/swaggerExamples';

@Controller('auth')
class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @Post('signup')
  @ApiTags('auth group')
  @ApiOperation({
    description:
      'Send a unique email address, password (minimum length 2) and name to register a new user.',
  })
  @ApiBody({
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
  })
  @ApiResponse({
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
  })
  @ApiBadRequestResponse({
    description: 'Password must be longer than or equal to 2 characters',
  })
  @ApiConflictResponse({
    description: 'This email is already taken',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  private signup(@Body() body: SignUpDto): Promise<AuthResponseType | never> {
    return this.service.signUp(body);
  }

  @ApiOperation({ description: 'This is the Sign In Endpoint.' })
  @ApiTags('auth group')
  @ApiBody({
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
  })
  @ApiResponse({
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
  })
  @ApiNotFoundResponse({
    description: 'User with this email is not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid password',
  })
  @Post('signin')
  @HttpCode(200)
  public async login(@Body() body: SignInDto): Promise<AuthResponseType> {
    const { token, user } = await this.service.signIn(body);
    return { token, user };
  }

  @Post('refresh')
  @ApiTags('auth group')
  @UseGuards(JwtAuthGuard)
  private refresh(@Req() { user }: Request): Promise<string | never> {
    return this.service.refresh(<UserEntity>user);
  }
}

export default AuthController;

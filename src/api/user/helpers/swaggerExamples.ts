import { UserRoleEnum } from '../auth/role/role.types';
import type { ApiResponseSchemaHost } from '@nestjs/swagger';

const USER_SCHEMA = {
  id: 1,
  name: 'Alex',
  email: 'alex@gmail.com',
  role: UserRoleEnum.USER,
};

const createStandartUserResponseSchema = (
  needToken?: boolean,
  isArray?: boolean,
) => {
  const userExample = isArray ? [USER_SCHEMA] : USER_SCHEMA;
  const properties: Record<string, unknown> = {
    user: {
      example: userExample,
    },
  };

  if (needToken) {
    properties.token = {
      type: 'string',
    };
  }

  const schema = {
    properties,
  };

  return schema as ApiResponseSchemaHost['schema'];
};

export default {
  USER_SCHEMA,
  createStandartUserResponseSchema,
};

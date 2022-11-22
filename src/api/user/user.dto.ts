import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class UpdateNameDto {
  @IsString()
  @IsOptional()
  public readonly name?: string;
}

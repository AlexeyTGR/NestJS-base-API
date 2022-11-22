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

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  public readonly name?: string;

  @IsEmail()
  @IsOptional()
  public readonly email?: string;

  @IsString()
  @IsOptional()
  public readonly password?: string;

  @IsString()
  @IsOptional()
  public readonly newPassword?: string;
}

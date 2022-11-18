import { Trim } from 'class-sanitizer';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SognInDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;
}

export class SignUpDto {
  @Trim()
  @IsEmail()
  public readonly email: string;

  @IsString()
  @MinLength(2)
  public readonly password: string;

  @IsString()
  @IsOptional()
  public readonly name?: string;
}

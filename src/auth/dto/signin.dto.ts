import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@example.com', description: 'user email' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ example: '123456', description: 'user password' })
  password: string;
}

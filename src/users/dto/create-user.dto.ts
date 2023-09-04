import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'example@example.com', description: 'sign up email' })
  email: string;

  @IsStrongPassword({
    minLength: 10,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  @ApiProperty({
    example: 'Senh4*Forte#',
    description: 'sign up password',
  })
  password: string;

  constructor(params?: Partial<CreateUserDto>) {
    Object.assign(this, params);
  }
}

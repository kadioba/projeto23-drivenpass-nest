import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EraseUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Senh4*Forte#',
    description: 'password confirmation to erase data',
  })
  password: string;
}

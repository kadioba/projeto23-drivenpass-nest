import { IsNotEmpty, IsString } from 'class-validator';

export class EraseUserDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}

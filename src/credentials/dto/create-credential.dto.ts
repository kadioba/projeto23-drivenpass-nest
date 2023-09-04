import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateCredentialDto {
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://example.com', description: 'url of login' })
  url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'example', description: 'username for login' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'example', description: 'password for login' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'example',
    description: 'label for login, chosen by user',
  })
  label: string;

  constructor(params?: Partial<CreateCredentialDto>) {
    Object.assign(this, params);
  }
}

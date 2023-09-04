import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Visa', description: 'card label, chosen by user' })
  label: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({
    example: '4242424242424242',
    description: 'card number',
  })
  number: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123',
    description: 'card cvv',
  })
  validationCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '01/22',
    description: 'card expiration date',
  })
  validationDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123123',
    description: 'card password',
  })
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'card is virtual',
  })
  isVirtual: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'card is credit',
  })
  isCredit: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: 'card is debit',
  })
  isDebit: boolean;

  constructor(params?: Partial<CreateCardDto>) {
    Object.assign(this, params);
  }
}

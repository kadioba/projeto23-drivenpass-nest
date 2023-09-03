import { IsBoolean, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsNumberString()
  @IsNotEmpty()
  number: string;

  @IsNumberString()
  @IsNotEmpty()
  validationCode: string;

  @IsString()
  @IsNotEmpty()
  validationDate: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  isVirtual: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isCredit: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isDebit: boolean;
}

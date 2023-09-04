import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  constructor(params?: Partial<CreateNoteDto>) {
    Object.assign(this, params);
  }
}

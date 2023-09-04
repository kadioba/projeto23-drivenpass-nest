import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Title 1',
    description: 'Note title',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Content 1',
    description: 'Note content',
  })
  content: string;

  constructor(params?: Partial<CreateNoteDto>) {
    Object.assign(this, params);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User as RequestUser } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @RequestUser() user: User) {
    return this.notesService.create(user, createNoteDto);
  }

  @Get()
  findAll(@RequestUser() user: User) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.notesService.findOne(user, id);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.notesService.remove(user, id);
  }
}

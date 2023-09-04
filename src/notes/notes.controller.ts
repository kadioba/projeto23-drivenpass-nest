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
import { AuthGuard } from '../guards/auth.guard';
import { User as RequestUser } from '../decorators/user.decorator';
import { User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user Note' })
  create(@Body() createNoteDto: CreateNoteDto, @RequestUser() user: User) {
    return this.notesService.create(user, createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user Notes' })
  findAll(@RequestUser() user: User) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user Note' })
  @ApiParam({ name: 'id', description: 'Note ID', example: 1 })
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.notesService.findOne(user, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user Note' })
  @ApiParam({ name: 'id', description: 'Note ID', example: 1 })
  remove(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.notesService.remove(user, id);
  }
}

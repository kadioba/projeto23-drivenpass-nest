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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Note created' })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 409,
    description: 'Note already exists',
  })
  @ApiOperation({ summary: 'Create a user Note' })
  create(@Body() createNoteDto: CreateNoteDto, @RequestUser() user: User) {
    return this.notesService.create(user, createNoteDto);
  }

  @ApiResponse({ status: 200, description: 'Notes retrieved' })
  @Get()
  @ApiOperation({ summary: 'Get all user Notes' })
  findAll(@RequestUser() user: User) {
    return this.notesService.findAll(user);
  }

  @ApiResponse({ status: 200, description: 'Note retrieved' })
  @ApiResponse({
    status: 404,
    description: 'Note does not exist',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @Get(':id')
  @ApiOperation({ summary: 'Get a user Note' })
  @ApiParam({ name: 'id', description: 'Note ID', example: 1 })
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.notesService.findOne(user, id);
  }

  @ApiResponse({ status: 200, description: 'Note deleted' })
  @ApiResponse({
    status: 404,
    description: 'Note does not exist',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
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

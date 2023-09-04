import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesRepository } from './notes.repository';
import { User } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async create(user: User, createNoteDto: CreateNoteDto) {
    const noteExists = await this.notesRepository.findByTitle(
      user,
      createNoteDto.title,
    );
    if (noteExists) {
      throw new ConflictException('Note already exists');
    }
    return await this.notesRepository.create(user, createNoteDto);
  }

  async findAll(user: User) {
    return await this.notesRepository.findAll(user);
  }

  async findOne(user: User, id: number) {
    const note = await this.notesRepository.findUnique(id);
    if (!note) {
      throw new NotFoundException('Note does not exist');
    }
    if (note.userId !== user.id) {
      throw new ForbiddenException('Note does not belong to user');
    }
    return note;
  }

  async remove(user: User, id: number) {
    const note = await this.findOne(user, id);
    return await this.notesRepository.remove(note.id);
  }

  async deleteAll(user: User) {
    return await this.notesRepository.deleteAll(user);
  }
}

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(user: User, createNoteDto: CreateNoteDto) {
    return this.prisma.notes.create({
      data: {
        ...createNoteDto,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  findAll(user: User) {
    return this.prisma.notes.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  findUnique(id: number) {
    return this.prisma.notes.findUnique({
      where: {
        id,
      },
    });
  }

  findByTitle(user: User, title: string) {
    return this.prisma.notes.findFirst({
      where: {
        title,
        user: {
          id: user.id,
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.notes.delete({
      where: {
        id,
      },
    });
  }

  deleteAll(user: User) {
    return this.prisma.notes.deleteMany({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}

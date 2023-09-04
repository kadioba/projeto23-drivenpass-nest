import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../src/prisma/prisma.service';

@Injectable()
export class NotesFactory {
  private title = faker.lorem.word();
  private content = faker.lorem.sentence();

  constructor(private readonly prisma: PrismaService) {}

  async persist(user: User) {
    return await this.prisma.notes.create({
      data: {
        title: this.title,
        content: this.content,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
}

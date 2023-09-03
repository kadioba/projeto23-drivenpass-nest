import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CryptrService } from 'src/cryptr/cryptr.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptr: CryptrService,
  ) {}

  create(user: User, createCardDto: CreateCardDto) {
    return this.prisma.cards.create({
      data: {
        ...createCardDto,
        password: this.cryptr.encrypt(createCardDto.password),
        validationCode: this.cryptr.encrypt(createCardDto.validationCode),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  findAll(user: User) {
    return this.prisma.cards.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  findUnique(id: number) {
    return this.prisma.cards.findUnique({
      where: {
        id,
      },
    });
  }

  findByLabel(user: User, label: string) {
    return this.prisma.cards.findFirst({
      where: {
        label,
        user: {
          id: user.id,
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.cards.delete({
      where: {
        id,
      },
    });
  }
}

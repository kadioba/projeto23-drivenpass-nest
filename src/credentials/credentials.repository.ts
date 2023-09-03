import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CryptrService } from 'src/cryptr/cryptr.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCredentialDto } from './dto/create-credential.dto';

@Injectable()
export class CredentialsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptr: CryptrService,
  ) {}

  create(user: User, createCredentialDto: CreateCredentialDto) {
    return this.prisma.credentials.create({
      data: {
        ...createCredentialDto,
        password: this.cryptr.encrypt(createCredentialDto.password),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  findAll(user: User) {
    return this.prisma.credentials.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  findUnique(id: number) {
    return this.prisma.credentials.findUnique({
      where: {
        id,
      },
    });
  }

  findByLabel(user: User, label: string) {
    return this.prisma.credentials.findFirst({
      where: {
        label,
        user: {
          id: user.id,
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.credentials.delete({
      where: {
        id,
      },
    });
  }
}

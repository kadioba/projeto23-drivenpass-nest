import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CryptrService } from '../../src/cryptr/cryptr.service';
import { User } from '@prisma/client';

@Injectable()
export class CredentialsFactory {
  private url = faker.internet.url();
  private username = faker.internet.userName();
  private password = faker.internet.password();
  private label = faker.lorem.word();

  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptr: CryptrService,
  ) {}

  async persist(user: User) {
    const createdCredential = await this.prisma.credentials.create({
      data: {
        url: this.url,
        username: this.username,
        password: this.cryptr.encrypt(this.password),
        label: this.label,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    createdCredential.password = this.password;
    return createdCredential;
  }
}

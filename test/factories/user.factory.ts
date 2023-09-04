import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserFactory {
  private email = faker.internet.email();
  private password = 'Senh4F0rt#!';
  private SALT = 10;

  constructor(private readonly prisma: PrismaService) {}

  async persist() {
    const createdUser = await this.prisma.user.create({
      data: {
        email: this.email,
        password: bcrypt.hashSync(this.password, this.SALT),
      },
    });
    createdUser.password = this.password;
    return createdUser;
  }
}

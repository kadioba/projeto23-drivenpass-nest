import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CryptrService } from '../../src/cryptr/cryptr.service';
import { PrismaService } from '../../src/prisma/prisma.service';

@Injectable()
export class CardsFactory {
  private label = faker.lorem.word();
  private number = faker.finance.creditCardNumber();
  private validationCode = faker.finance.creditCardCVV();
  private validationDate = faker.date.future.toString();
  private password = faker.internet.password();
  private isVirtual = faker.datatype.boolean();
  private isCredit = faker.datatype.boolean();
  private isDebit = faker.datatype.boolean();

  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptr: CryptrService,
  ) {}

  async persist(user: User) {
    const createdCard = await this.prisma.cards.create({
      data: {
        label: this.label,
        number: this.number,
        validationCode: this.cryptr.encrypt(this.validationCode),
        validationDate: this.validationDate,
        password: this.cryptr.encrypt(this.password),
        isVirtual: this.isVirtual,
        isCredit: this.isCredit,
        isDebit: this.isDebit,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    createdCard.validationCode = this.validationCode;
    createdCard.password = this.password;
    return createdCard;
  }
}

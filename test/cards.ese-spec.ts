import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e.utils';
import { faker } from '@faker-js/faker';
import { UserFactory } from './factories/user.factory';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { UsersRepository } from '../src/users/users.repository';
import { CryptrService } from '../src/cryptr/cryptr.service';
import { CreateCardDto } from 'src/cards/dto/create-card.dto';
import { CardsFactory } from './factories/cards.factory';

describe('Auth E2E Tests (e2e)', () => {
  let app: INestApplication;
  const prisma: PrismaService = new PrismaService();
  const jwt: JwtService = new JwtService({ secret: process.env.JWT_SECRET });
  const cryptr: CryptrService = new CryptrService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        AuthService,
        UsersService,
        UsersRepository,
        JwtService,
        CryptrService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    await E2EUtils.cleanDb(prisma);
  });

  it('POST /cards => should return 201', async () => {
    const card: CreateCardDto = new CreateCardDto({
      label: faker.lorem.word(),
      number: faker.finance.creditCardNumber(),
      validationCode: faker.finance.creditCardCVV(),
      validationDate: faker.date.future.toString(),
      password: faker.internet.password(),
      isVirtual: faker.datatype.boolean(),
      isCredit: faker.datatype.boolean(),
      isDebit: faker.datatype.boolean(),
    });

    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${token.token}`)
      .send({
        ...card,
      });

    expect(response.status).toBe(201);
  });

  it('GET /cards => should return 200 and cards', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const card = await new CardsFactory(prisma, cryptr).persist(user);

    const response = await request(app.getHttpServer())
      .get('/cards')
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      {
        ...card,
        id: expect.any(Number),
        userId: user.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ]);
  });

  it('GET /card/:id => should return 200 and card', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const card = await new CardsFactory(prisma, cryptr).persist(user);

    const response = await request(app.getHttpServer())
      .get(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ...card,
      id: expect.any(Number),
      userId: user.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('DELETE /credentials/:id => should delete a credential', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const card = await new CardsFactory(prisma, cryptr).persist(user);

    const response = await request(app.getHttpServer())
      .delete(`/credentials/${card.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(200);

    const deletedCard = await prisma.cards.findUnique({
      where: {
        id: card.id,
      },
    });
    expect(deletedCard).toBeNull();
  });
});

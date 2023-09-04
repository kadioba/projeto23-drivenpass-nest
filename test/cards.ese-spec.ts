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

  it('POST /cards => should return Bad Request if body is invalid', async () => {
    const card: CreateCardDto = new CreateCardDto({
      label: faker.lorem.word(),
      number: faker.finance.creditCardNumber(),
      validationCode: faker.finance.creditCardCVV(),
    });

    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${token.token}`)
      .send({
        ...card,
      });

    expect(response.status).toBe(400);
  });

  it('POST /cards => should return Conflict if user already has a card with the same label', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const card = await new CardsFactory(prisma, cryptr).persist(user);

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${token.token}`)
      .send({
        label: card.label,
        number: card.number,
        validationCode: card.validationCode,
        validationDate: card.validationDate,
        password: card.password,
        isVirtual: card.isVirtual,
        isCredit: card.isCredit,
        isDebit: card.isDebit,
      });

    expect(response.status).toBe(409);
  });

  it('POST /cards => should return 201 even if another user already has a card with the same label', async () => {
    const user = await new UserFactory(prisma).persist();
    const card = await new CardsFactory(prisma, cryptr).persist(user);

    const anotherUser = await new UserFactory(prisma).persist();
    const anotherToken = await E2EUtils.authenticate(jwt, anotherUser);

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${anotherToken.token}`)
      .send({
        label: card.label,
        number: card.number,
        validationCode: card.validationCode,
        validationDate: card.validationDate,
        password: card.password,
        isVirtual: card.isVirtual,
        isCredit: card.isCredit,
        isDebit: card.isDebit,
      });

    expect(response.status).toBe(201);
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

  it('GET /card/:id => should Not Found if card does not exist', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const card = await new CardsFactory(prisma, cryptr).persist(user);
    await prisma.cards.delete({
      where: {
        id: card.id,
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(404);
  });

  it('GET /card/:id => should Forbidden if card belongs to another user', async () => {
    const user = await new UserFactory(prisma).persist();
    const card = await new CardsFactory(prisma, cryptr).persist(user);
    const anotherUser = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, anotherUser);

    const response = await request(app.getHttpServer())
      .get(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(403);
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

  it('DELETE /card/:id => should return Not Found if card does not exist', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const card = await new CardsFactory(prisma, cryptr).persist(user);
    await prisma.cards.delete({
      where: {
        id: card.id,
      },
    });

    const response = await request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(404);
  });

  it('DELETE /card/:id => should Forbidden if card belongs to another user', async () => {
    const user = await new UserFactory(prisma).persist();
    const card = await new CardsFactory(prisma, cryptr).persist(user);
    const anotherUser = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, anotherUser);

    const response = await request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(403);
  });

  it('DELETE /card/:id => should delete a credential', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const card = await new CardsFactory(prisma, cryptr).persist(user);

    const response = await request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
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

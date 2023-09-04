import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e.utils';
import { faker } from '@faker-js/faker';
import { UserFactory } from './factories/user.factory';
import * as request from 'supertest';
import { CreateCredentialDto } from '../src/credentials/dto/create-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { UsersRepository } from '../src/users/users.repository';
import { CredentialsFactory } from './factories/credentials.factory';
import { CryptrService } from '../src/cryptr/cryptr.service';

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
    const credential: CreateCredentialDto = new CreateCredentialDto({
      url: faker.internet.url(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      label: faker.lorem.word(),
    });

    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .set('Authorization', `Bearer ${token.token}`)
      .send({
        ...credential,
      });

    expect(response.status).toBe(201);
  });

  it('GET /credentials => should return 200 and credentials', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const credentials = await new CredentialsFactory(prisma, cryptr).persist(
      user,
    );

    const response = await request(app.getHttpServer())
      .get('/credentials')
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      {
        ...credentials,
        id: expect.any(Number),
        userId: user.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ]);
  });

  it('GET /credentials/:id => should return 200 and credential', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const credential = await new CredentialsFactory(prisma, cryptr).persist(
      user,
    );

    const response = await request(app.getHttpServer())
      .get(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ...credential,
      id: expect.any(Number),
      userId: user.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('DELETE /credentials/:id => should delete a credential', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const credential = await new CredentialsFactory(prisma, cryptr).persist(
      user,
    );

    const response = await request(app.getHttpServer())
      .delete(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(200);

    const deletedCredential = await prisma.credentials.findUnique({
      where: {
        id: credential.id,
      },
    });
    expect(deletedCredential).toBeNull();
  });
});

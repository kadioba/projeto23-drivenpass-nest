import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e.utils';
import { JwtService } from '@nestjs/jwt';
import { CryptrService } from '../src/cryptr/cryptr.service';
import { UserFactory } from './factories/user.factory';
import { CredentialsFactory } from './factories/credentials.factory';
import { NotesFactory } from './factories/notes.factory';
import { CardsFactory } from './factories/cards.factory';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { UsersRepository } from '../src/users/users.repository';

describe('AppController (e2e)', () => {
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

  it('GET /health => should return 200', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('I’m okay!');
  });

  it('DELETE /erase => should delete all user data', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const credential = await new CredentialsFactory(prisma, cryptr).persist(
      user,
    );
    const note = await new NotesFactory(prisma).persist(user);
    const card = await new CardsFactory(prisma, cryptr).persist(user);

    const response = await request(app.getHttpServer())
      .delete('/erase')
      .set('Authorization', `Bearer ${token.token}`)
      .send({ password: user.password });

    expect(response.status).toBe(200);

    const deletedUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    expect(deletedUser).toBeNull();

    const deletedCredential = await prisma.credentials.findUnique({
      where: {
        id: credential.id,
      },
    });
    expect(deletedCredential).toBeNull();

    const deletedNote = await prisma.notes.findUnique({
      where: {
        id: note.id,
      },
    });
    expect(deletedNote).toBeNull();

    const deletedCard = await prisma.cards.findUnique({
      where: {
        id: card.id,
      },
    });
    expect(deletedCard).toBeNull();
  });
});

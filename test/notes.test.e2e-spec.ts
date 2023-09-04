import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e.utils';
import { fa, faker } from '@faker-js/faker';
import { UserFactory } from './factories/user.factory';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { UsersRepository } from '../src/users/users.repository';
import { CryptrService } from '../src/cryptr/cryptr.service';
import { CreateNoteDto } from '../src/notes/dto/create-note.dto';
import { NotesFactory } from './factories/notes.factory';

describe('Auth E2E Tests (e2e)', () => {
  let app: INestApplication;
  const prisma: PrismaService = new PrismaService();
  const jwt: JwtService = new JwtService({ secret: process.env.JWT_SECRET });

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

  it('POST /notes => should return Bad Request if body is invalid', async () => {
    const note: CreateNoteDto = new CreateNoteDto({
      title: faker.lorem.word(),
    });

    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);

    const response = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${token.token}`)
      .send({
        ...note,
      });

    expect(response.status).toBe(400);
  });

  it('POST /notes => should return Conflict if user already has a note with the same title', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const note = await new NotesFactory(prisma).persist(user);

    const response = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${token.token}`)
      .send({
        title: note.title,
        content: faker.lorem.sentence(),
      });

    expect(response.status).toBe(409);
  });

  it('POST /notes => should return 201 even if another user already has a note with the same title', async () => {
    const user = await new UserFactory(prisma).persist();
    const note = await new NotesFactory(prisma).persist(user);

    const anotherUser = await new UserFactory(prisma).persist();
    const anotherToken = await E2EUtils.authenticate(jwt, anotherUser);

    const response = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${anotherToken.token}`)
      .send({
        title: note.title,
        content: faker.lorem.sentence(),
      });

    expect(response.status).toBe(201);
  });

  it('POST /notes => should return 201', async () => {
    const note: CreateNoteDto = new CreateNoteDto({
      title: faker.lorem.word(),
      content: faker.lorem.paragraph(),
    });

    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);

    const response = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${token.token}`)
      .send({
        ...note,
      });

    expect(response.status).toBe(201);
  });

  it('GET /notes => should return 200 and notes', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const note = await new NotesFactory(prisma).persist(user);

    const response = await request(app.getHttpServer())
      .get('/notes')
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body).toEqual([
      {
        ...note,
        id: expect.any(Number),
        userId: user.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ]);
  });

  it('GET /notes/:id => should return Not Found if credential does not exist', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const note = await new NotesFactory(prisma).persist(user);
    await prisma.notes.delete({
      where: {
        id: note.id,
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(404);
  });

  it('GET /notes/:id => should return Forbidden if credential belongs to another user', async () => {
    const user = await new UserFactory(prisma).persist();
    const note = await new NotesFactory(prisma).persist(user);
    const anotherUser = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, anotherUser);

    const response = await request(app.getHttpServer())
      .get(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(403);
  });

  it('GET /notes/:id => should return 200 and credential', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const note = await new NotesFactory(prisma).persist(user);

    const response = await request(app.getHttpServer())
      .get(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ...note,
      id: expect.any(Number),
      userId: user.id,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('DELETE /notes/:id => should return Not Found if credential does not exist', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const note = await new NotesFactory(prisma).persist(user);
    await prisma.notes.delete({
      where: {
        id: note.id,
      },
    });

    const response = await request(app.getHttpServer())
      .delete(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(404);
  });

  it('DELETE /notes/:id => should return Forbidden if credential belongs to another user', async () => {
    const user = await new UserFactory(prisma).persist();
    const note = await new NotesFactory(prisma).persist(user);
    const anotherUser = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, anotherUser);

    const response = await request(app.getHttpServer())
      .delete(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(403);
  });

  it('DELETE /notes/:id => should delete a credential', async () => {
    const user = await new UserFactory(prisma).persist();
    const token = await E2EUtils.authenticate(jwt, user);
    const note = await new NotesFactory(prisma).persist(user);

    const response = await request(app.getHttpServer())
      .delete(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(200);

    const deletedNote = await prisma.notes.findUnique({
      where: {
        id: note.id,
      },
    });
    expect(deletedNote).toBeNull();
  });
});

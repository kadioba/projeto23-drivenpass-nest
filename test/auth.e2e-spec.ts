import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e.utils';
import { SignUpDto } from '../src/auth/dto/signup.dto';
import { faker } from '@faker-js/faker';
import { UserFactory } from './factories/user.factory';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';

describe('Auth E2E Tests (e2e)', () => {
  let app: INestApplication;
  const prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [JwtService],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    await E2EUtils.cleanDb(prisma);
  });

  it('POST /users/sign-up => should return BadRequest if body is invalid', async () => {
    const user: SignUpDto = new SignUpDto({
      email: faker.internet.email(),
    });

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        ...user,
      });

    expect(response.status).toBe(400);
  });

  it('POST /users/sign-up => should return BadRequest if password id weak', async () => {
    const user: SignUpDto = new SignUpDto({
      email: faker.internet.email(),
      password: '123',
    });

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        ...user,
      });

    expect(response.status).toBe(400);
  });

  it('POST /users/sign-up => should return Conflict if email is already registered', async () => {
    const userRegistered = await new UserFactory(prisma).persist();
    const newUser: SignUpDto = new SignUpDto({
      email: userRegistered.email,
      password: userRegistered.password,
    });

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        ...newUser,
      });

    expect(response.status).toBe(409);
  });

  it('POST /user/sign-up => should return 201', async () => {
    const user: SignUpDto = new SignUpDto({
      email: faker.internet.email(),
      password: 'Senh4F0rt#!',
    });

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        ...user,
      });

    expect(response.status).toBe(201);
  });

  it('POST /user/sign-in => should return BadRequest if body is invalid', async () => {
    const user: SignUpDto = new SignUpDto({
      email: faker.internet.email(),
    });

    const response = await request(app.getHttpServer())
      .post('/users/sign-in')
      .send({
        ...user,
      });

    expect(response.status).toBe(400);
  });

  it('POST /user/sign-in => should return Unauthorized if password is wrong', async () => {
    const user = await new UserFactory(prisma).persist();

    const response = await request(app.getHttpServer())
      .post('/users/sign-in')
      .send({
        email: user.email,
        password: 'wrong password',
      });

    expect(response.status).toBe(401);
  });

  it('POST /user/sign-in => should return 200 and a token', async () => {
    const user = await new UserFactory(prisma).persist();

    const response = await request(app.getHttpServer())
      .post('/users/sign-in')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});

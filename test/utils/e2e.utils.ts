import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../src/prisma/prisma.service';
import { User } from '@prisma/client';

export class E2EUtils {
  constructor(private readonly prisma: PrismaService) {}

  static async cleanDb(prisma: PrismaService) {
    await prisma.cards.deleteMany();
    await prisma.notes.deleteMany();
    await prisma.credentials.deleteMany();
    await prisma.user.deleteMany();
  }
  static async authenticate(jwtService: JwtService, user: User) {
    const { id, email } = user;
    const EXPIRATION_TIME = '1h';
    const ISSUER = 'Drivenpass';
    const AUDIENCE = 'users';

    const token = jwtService.sign(
      { email },
      {
        expiresIn: EXPIRATION_TIME,
        subject: String(id),
        issuer: ISSUER,
        audience: AUDIENCE,
      },
    );
    return { token };
  }
}

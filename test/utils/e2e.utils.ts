import { PrismaService } from '../../src/prisma/prisma.service';

export class E2EUtils {
  constructor(private readonly prisma: PrismaService) {}

  static async cleanDb(prisma: PrismaService) {
    await prisma.cards.deleteMany();
    await prisma.notes.deleteMany();
    await prisma.credentials.deleteMany();
    await prisma.user.deleteMany();
  }
}

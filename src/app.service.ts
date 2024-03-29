import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { EraseUserDto } from './dto/erase-user.dto';
import { CredentialsService } from './credentials/credentials.service';
import { NotesService } from './notes/notes.service';
import { CardsService } from './cards/cards.service';

@Injectable()
export class AppService {
  constructor(
    private readonly authService: AuthService,
    private readonly credentialsService: CredentialsService,
    private readonly notesService: NotesService,
    private readonly cardsService: CardsService,
    private readonly usersService: UsersService,
  ) {}
  getHealth(): string {
    return 'I’m okay!';
  }

  async eraseAccount(user: User, eraseUserDto: EraseUserDto) {
    await this.authService.checkPassword(user, eraseUserDto.password);
    await this.credentialsService.deleteAll(user);
    await this.notesService.deleteAll(user);
    await this.cardsService.deleteAll(user);
    await this.usersService.delete(user);
  }
}

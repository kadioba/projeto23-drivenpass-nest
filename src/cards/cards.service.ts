import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardsRepository } from './cards.repository';
import { CryptrService } from 'src/cryptr/cryptr.service';
import { User } from '@prisma/client';

@Injectable()
export class CardsService {
  constructor(
    private readonly cardsRepository: CardsRepository,
    private readonly cryptr: CryptrService,
  ) {}

  async create(user: User, createCardDto: CreateCardDto) {
    const cardExists = await this.cardsRepository.findByLabel(
      user,
      createCardDto.label,
    );
    if (cardExists) {
      throw new ConflictException('Card already exists');
    }
    const card = await this.cardsRepository.create(user, createCardDto);
    delete card.password;
    delete card.id;
    return card;
  }

  async findAll(user: User) {
    const cards = await this.cardsRepository.findAll(user);
    return cards.map((card) => {
      card.password = this.cryptr.decrypt(card.password);
      card.validationCode = this.cryptr.decrypt(card.validationCode);
      return card;
    });
  }

  async findOne(user: User, id: number) {
    const card = await this.cardsRepository.findUnique(id);
    if (!card) {
      throw new NotFoundException('Card does not exist');
    }
    if (card.userId !== user.id) {
      throw new ForbiddenException('Card does not belong to user');
    }
    card.password = this.cryptr.decrypt(card.password);
    card.validationCode = this.cryptr.decrypt(card.validationCode);
    return card;
  }

  async remove(user: User, id: number) {
    const card = await this.findOne(user, id);
    return await this.cardsRepository.remove(card.id);
  }
}

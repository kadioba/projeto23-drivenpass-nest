import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User as RequestUser } from '../decorators/user.decorator';
import { User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Cards')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user Card' })
  create(@Body() createCardDto: CreateCardDto, @RequestUser() user: User) {
    return this.cardsService.create(user, createCardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user Cards' })
  findAll(@RequestUser() user: User) {
    return this.cardsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user Card' })
  @ApiParam({ name: 'id', description: 'Card ID', example: 1 })
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.cardsService.findOne(user, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user Card' })
  @ApiParam({ name: 'id', description: 'Card ID', example: 1 })
  remove(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.cardsService.remove(user, id);
  }
}

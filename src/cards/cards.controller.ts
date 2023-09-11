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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Cards')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Card created' })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 409,
    description: 'Card already exists',
  })
  @ApiOperation({ summary: 'Create a user Card' })
  create(@Body() createCardDto: CreateCardDto, @RequestUser() user: User) {
    return this.cardsService.create(user, createCardDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Cards retrieved' })
  @ApiOperation({ summary: 'Get all user Cards' })
  findAll(@RequestUser() user: User) {
    return this.cardsService.findAll(user);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Card retrieved' })
  @ApiResponse({
    status: 404,
    description: 'Card does not exist',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiOperation({ summary: 'Get a user Card' })
  @ApiParam({ name: 'id', description: 'Card ID', example: 1 })
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.cardsService.findOne(user, id);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Card deletes' })
  @ApiResponse({
    status: 404,
    description: 'Card does not exist',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiOperation({ summary: 'Delete a user Card' })
  @ApiParam({ name: 'id', description: 'Card ID', example: 1 })
  remove(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.cardsService.remove(user, id);
  }
}

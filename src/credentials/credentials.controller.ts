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
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User as RequestUser } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @RequestUser() user: User,
  ) {
    return this.credentialsService.create(user, createCredentialDto);
  }

  @Get()
  findAll(@RequestUser() user: User) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.credentialsService.findOne(user, id);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.credentialsService.remove(user, id);
  }
}

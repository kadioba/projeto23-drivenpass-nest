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
import { AuthGuard } from '../guards/auth.guard';
import { User as RequestUser } from '../decorators/user.decorator';
import { User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Credentials')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user credential' })
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @RequestUser() user: User,
  ) {
    return this.credentialsService.create(user, createCredentialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user credentials' })
  findAll(@RequestUser() user: User) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user credential' })
  @ApiParam({ name: 'id', description: 'Credential ID', example: 1 })
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.credentialsService.findOne(user, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user credential' })
  @ApiParam({ name: 'id', description: 'Credential ID', example: 1 })
  remove(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.credentialsService.remove(user, id);
  }
}

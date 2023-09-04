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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Credentials')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @ApiResponse({ status: 201, description: 'Credential created' })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 409,
    description: 'Credential already exists',
  })
  @Post()
  @ApiOperation({ summary: 'Create a user credential' })
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @RequestUser() user: User,
  ) {
    return this.credentialsService.create(user, createCredentialDto);
  }

  @ApiResponse({ status: 200, description: 'Credentials retrieved' })
  @Get()
  @ApiOperation({ summary: 'Get all user credentials' })
  findAll(@RequestUser() user: User) {
    return this.credentialsService.findAll(user);
  }

  @ApiResponse({ status: 200, description: 'Credential retrieved' })
  @ApiResponse({
    status: 404,
    description: 'Credential does not exist',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Credential does not belong to user',
  })
  @Get(':id')
  @ApiOperation({ summary: 'Get a user credential' })
  @ApiParam({ name: 'id', description: 'Credential ID', example: 1 })
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
    @RequestUser() user: User,
  ) {
    return this.credentialsService.findOne(user, id);
  }

  @ApiResponse({ status: 200, description: 'Credential deleted' })
  @ApiResponse({
    status: 404,
    description: 'Credential does not exist',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Credential does not belong to user',
  })
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

import { Body, Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { EraseUserDto } from './dto/erase-user.dto';
import { User as RequestUser } from './decorators/user.decorator';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get health status' })
  getHealth(): string {
    return this.appService.getHealth();
  }

  @ApiOperation({ summary: 'Delete all user data' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('erase')
  eraseAccount(@Body() eraseUserDto: EraseUserDto, @RequestUser() user: User) {
    return this.appService.eraseAccount(user, eraseUserDto);
  }
}

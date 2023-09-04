import { Body, Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { EraseUserDto } from './dto/erase-user.dto';
import { User as RequestUser } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard)
  @Delete('erase')
  eraseAccount(@Body() eraseUserDto: EraseUserDto, @RequestUser() user: User) {
    return this.appService.eraseAccount(user, eraseUserDto);
  }
}

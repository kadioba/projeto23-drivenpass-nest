import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    return await this.usersRepository.create(createUserDto);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findByEmail(email);
  }

  async findUnique(id: number) {
    return this.usersRepository.findUnique(id);
  }

  async delete(user: User) {
    return await this.usersRepository.delete(user.id);
  }
}

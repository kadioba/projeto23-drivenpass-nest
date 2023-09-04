import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private EXPIRATION_TIME = '1h';
  private ISSUER = 'Drivenpass';
  private AUDIENCE = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = await this.usersService.findByEmail(signUpDto.email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    const createdUser = await this.usersService.create(signUpDto);
    delete createdUser.password;
    delete createdUser.id;
    delete createdUser.updatedAt;

    return createdUser;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('User or password is incorrect');
    }

    const valid = await bcrypt.compare(signInDto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('User or password is incorrect');
    }

    return this.createToken(user);
  }

  private createToken(user: User) {
    const { id, email } = user;

    const token = this.jwtService.sign(
      { email },
      {
        expiresIn: this.EXPIRATION_TIME,
        subject: String(id),
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
      },
    );

    return { token };
  }

  checkPassword(user: User, password: string) {
    const valid = bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('User or password is incorrect');
    }
    return true;
  }

  checkToken(token: string) {
    const data = this.jwtService.verify(token);

    return data;
  }
}

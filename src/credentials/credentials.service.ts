import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { User } from '@prisma/client';
import { CryptrService } from 'src/cryptr/cryptr.service';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly cryptr: CryptrService,
  ) {}

  async create(user: User, createCredentialDto: CreateCredentialDto) {
    const credentialExists = await this.credentialsRepository.findByLabel(
      user,
      createCredentialDto.label,
    );
    if (credentialExists) {
      throw new ConflictException('Credential already exists');
    }
    const credential = await this.credentialsRepository.create(
      user,
      createCredentialDto,
    );
    delete credential.password;
    delete credential.id;
    delete credential.updatedAt;
    return credential;
  }

  async findAll(user: User) {
    const credentials = await this.credentialsRepository.findAll(user);
    return credentials.map((credential) => {
      credential.password = this.cryptr.decrypt(credential.password);
      return credential;
    });
  }

  async findOne(user: User, id: number) {
    const credential = await this.credentialsRepository.findUnique(id);
    if (!credential) {
      throw new NotFoundException('Credential does not exist');
    }
    if (credential.userId !== user.id) {
      throw new ForbiddenException('Credential does not belong to user');
    }
    credential.password = this.cryptr.decrypt(credential.password);
    return credential;
  }

  async remove(user: User, id: number) {
    const credential = await this.findOne(user, id);
    return this.credentialsRepository.remove(credential.id);
  }
}

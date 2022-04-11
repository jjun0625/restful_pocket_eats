import { UserRepository } from './user.repository';
import { User } from './user.entitiy';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    const isExist = await this.userRepository.findOne({ email });
    console.log('user', isExist);
    if (isExist) {
      return {
        ok: false,
        code: 409,
        error: '이미 가입되어있는 유저입니다.',
      };
    }
    await this.userRepository.save(
      this.userRepository.create({ email, password, role }),
    );
    return {
      ok: true,
      code: 200,
    };
  }
}

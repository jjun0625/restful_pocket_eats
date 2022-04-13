import { JwtService } from './../jwt/jwt.service';
import { LoginOutput, LoginInput } from './dto/login.dto';
import { UserRepository } from './user.repository';

import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const isExist = await this.userRepository.findOne({ email });

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
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        code: 409,
        error: '계정을 만들 수 없습니다.',
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        return {
          ok: false,
          error: '유저가 없습니다.',
          code: 401,
        };
      }
      const passwordCorrect = await user.checkPassword(password.toString());
      if (passwordCorrect === false) {
        return {
          code: 409,
          error: '비밀번호가 잘못되었습니다.',
          ok: false,
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
        code: 200,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        code: 404,
        error: '로그인에 실패했습니다.',
      };
    }
  }
}

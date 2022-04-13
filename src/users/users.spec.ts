import { JwtService } from './../jwt/jwt.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entitiy';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';
describe('UserService', () => {
  let usersService: UsersService;
  let userRepository: Partial<Record<keyof UserRepository, jest.Mock>>;
  let jwtService: JwtService;

  const mockRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  });

  const mockJwtService = () => ({
    sign: jest.fn(() => 'signed-token-baby'),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(UserRepository));
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: '',
      password: '',
      role: 0,
    };
    it('유저가 존재할 때  실패해야한다', async () => {
      userRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'lalala',
      });
      const result = await usersService.createAccount(createAccountArgs);
      expect(result).toMatchObject({
        ok: false,
        code: 409,
        error: '이미 가입되어있는 유저입니다.',
      });
    });
    it('새로운 유저 생성', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      userRepository.create.mockReturnValue(createAccountArgs);
      userRepository.save.mockResolvedValue(createAccountArgs);
      const result = await usersService.createAccount(createAccountArgs);

      expect(result).toEqual({
        ok: true,
        code: 200,
      });
    });
  });

  describe('login', () => {
    const loginArgs = {
      email: 'fd@naver.com',
      password: 'password',
    };
    it('유저가 없다면 실패!', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await usersService.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: '유저가 없습니다.',
        code: 401,
      });
    });
    it('비밀번호 틀리면 로그인 실패', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      userRepository.findOne.mockResolvedValue(mockedUser);
      const result = await usersService.login(loginArgs);
      expect(result).toEqual({
        code: 409,
        error: '비밀번호가 잘못되었습니다.',
        ok: false,
      });
    });
  });
});

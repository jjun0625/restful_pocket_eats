import { JwtModuleOptions } from './jwt.interface';
import * as jwt from 'jsonwebtoken';
import { Inject } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';

export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}

  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.options.privateKey);
  }
}

import { JwtService } from './jwt.service';
import { JwtModuleOptions } from './jwt.interface';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from './jwt.constants';

@Module({})
@Global()
export class JwtModule {
  static forRoot(option: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: option,
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}

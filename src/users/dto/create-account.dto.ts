import { CoreOutput } from './../../common/dto/output.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../user.entitiy';

export class CreateAccountInput {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

export class CreateAccountOutput extends CoreOutput {}

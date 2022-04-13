import { IsNotEmpty, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/output.dto';

export class LoginInput {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginOutput extends CoreOutput {
  @IsString()
  token?: string;
}

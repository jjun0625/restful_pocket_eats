import { Column } from 'typeorm';
import { IsEnum } from 'class-validator';

enum UserRole {
  client,
  owner,
  delivery,
}

export class User {
  @Column()
  email: string;

  @Column()
  passoword: string;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  verified: boolean;
}

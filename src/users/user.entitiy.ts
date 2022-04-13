import { CoreEntity } from './../common/common.entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEnum } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';

export enum UserRole {
  client,
  owner,
  delivery,
}

@Entity({
  name: 'user',
})
export class User extends CoreEntity {
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hassPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password.toString(), 10);
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(password, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}

import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entitiy';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}

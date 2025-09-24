import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/prisma';

@Injectable()
export class UsersService {
  async createUser(email: string, frequency: string) {
    return prisma.user.create({ data: { email, frequency } });
  }

  async findAll() {
    return prisma.user.findMany();
  }
}

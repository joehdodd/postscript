import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
  async createUser(email: string, frequency: string) {
    return prisma.user.create({ data: { email, frequency } });
  }

  async findAll() {
    return prisma.user.findMany();
  }
}

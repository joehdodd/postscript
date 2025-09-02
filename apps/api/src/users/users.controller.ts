import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: { email: string; frequency: string }) {
    return this.usersService.createUser(body.email, body.frequency);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel, Post as PostModel, User } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('users')
    getUsers(): Promise<User[]> {
  
      return this.usersService.getAllUsers();
    }





}

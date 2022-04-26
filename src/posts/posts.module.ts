import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  providers: [PostsResolver, PostsService , PrismaService],
  controllers: [PostsController],
})
export class PostsModule {}

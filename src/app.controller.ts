import { Body, CacheKey, CacheTTL, CACHE_MANAGER, Controller, Delete, Get, Inject, Logger, OnModuleInit, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthGuard,
  Public,
  ResourceGuard,
  RoleMatchingMode,
  Roles,
} from 'nest-keycloak-connect';
import { PrismaService } from 'nestjs-prisma';
import { AppService } from './app.service';
import { KillDragonMessage } from './KillDragonMessage';
import { UsersService } from './users/users.service';
import { User as UserModel, Post as PostModel, Prisma } from '@prisma/client'

@Controller()
@UseGuards(AuthGuard, ResourceGuard)
export class AppController /* implements OnModuleInit */ {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService ,
    private readonly prismaService: PrismaService ,
    
    /* @Inject('HERO_SERVICE') private readonly clientKafka: ClientKafka */ ) {}


  /*
  onModuleInit() {
    this.clientKafka.subscribeToResponseOf('hero.kill.dragon');
  }

  @MessagePattern('my-first-topic') // Our topic name
  getHelloKafka(@Payload() message) {
    console.log(message.value);
    return 'Hello World';
  }

  @Get()
  HelloProducer() {
    return this.clientKafka.send('my-first-topic', 'Hello Kafka'); // args - topic, message
  }

  @MessagePattern('hero.kill.dragon')
  killDragon(@Payload() message: KillDragonMessage): any {
    const dragonId = message.dragonId;
    const items = [
      { id: 1, name: 'Mythical Sword' },
      { id: 2, name: 'Key to Dungeon' },
    ];
    return items;
  }
  
  */

  @Get('Hello-Kafka')
  getHelloKafka() {

    this.logger.log('Hello-Kafka');
    return this.appService.getHelloKafka();
  }

  @Get()
  @Public()
  getHello(): string {
    this.logger.log('Getting stuff');

    return this.appService.getHello();
  }

  @Get('hello/:name')
  @Roles({ roles: ['admin', 'realm:sysadmin'], mode: RoleMatchingMode.ALL })
  getHelloName(@Param('name') name: string): string {
    return this.appService.getHelloName(name);
  }

  @MessagePattern({cmd: 'greeting'})
  getGreetingMessage(name: string): string {
    return `Hello ${name}`;
  }

  @MessagePattern({cmd: 'greeting-async'})
  async getGreetingMessageAysnc(name: string): Promise<string> {
    return `Hello ${name} Async`;
  }

  @EventPattern('book-created')
  async handleBookCreatedEvent(data: Record<string, unknown>) {
    console.log(data);
  }

  @Get("/greeting")
  async getHelloClient() {
    return this.appService.getHello();
  }

  @Get("/greeting-async")
  async getHelloAsync() {
    return this.appService.getHelloAsync();
  }

  @Get("/publish-event")
  async publishEvent() {
    this.appService.publishEvent();
  }

  @Get("redis")
  @CacheKey('some_route')
  @CacheTTL(30)
  async getHelloRedisCache() {
    this.logger.log('getHelloRedisCache');
    return this.appService.getHelloRedisCache();
  }

}

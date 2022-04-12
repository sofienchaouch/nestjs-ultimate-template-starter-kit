import { CacheKey, CacheTTL, CACHE_MANAGER, Controller, Get, Inject, Logger, OnModuleInit, Param, UseGuards } from '@nestjs/common';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthGuard,
  Public,
  ResourceGuard,
  RoleMatchingMode,
  Roles,
} from 'nest-keycloak-connect';
import { AppService } from './app.service';
import { KillDragonMessage } from './KillDragonMessage';
import { UsersService } from './users/users.service';
@Controller()
@UseGuards(AuthGuard, ResourceGuard)
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService , @Inject('AUTH_SERVICE') private readonly clientKafka: ClientKafka ) {}

  onModuleInit() {
    this.clientKafka.subscribeToResponseOf('hero.kill.dragon');
  }

  @MessagePattern('my-first-topic') // Our topic name
  getHelloKafka(@Payload() message) {
    console.log(message.value);
    return 'Hello World';
  }

  @Get()
  Producer() {
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

  @Get()
  @CacheKey('some_route')
  @CacheTTL(30)
  async getHelloRedisCache() {
    return this.appService.getHelloRedisCache();
  }
}

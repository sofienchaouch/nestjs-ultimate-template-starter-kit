import { CacheKey, CacheTTL, CACHE_MANAGER, Controller, Get, Inject, Logger, Param, UseGuards } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import {
  AuthGuard,
  Public,
  ResourceGuard,
  RoleMatchingMode,
  Roles,
} from 'nest-keycloak-connect';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
@Controller()
@UseGuards(AuthGuard, ResourceGuard)
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService ) {}

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

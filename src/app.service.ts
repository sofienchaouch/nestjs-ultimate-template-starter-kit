import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProducerService } from './kafka/producer.service';
import { RedisCacheService } from './redis/redis.service';


@Injectable()
export class AppService {
  constructor(
    @Inject('GREETING_SERVICE') private client: ClientProxy,
    private readonly redisCache: RedisCacheService,
    private readonly producerService: ProducerService
  ) /** @Inject('ITEM_MICROSERVICE') private readonly client: ClientProxy */ {}
  private readonly logger = new Logger(AppService.name);

  /*
  createItem(createItemDto) {
    return this.client.send({ role: 'item', cmd: 'create' }, createItemDto);
  }
  getItemById(id: number) {
    return this.client.send({ role: 'item', cmd: 'get-by-id' }, id); 
  }
*/

async getHelloKafka() {
  await this.producerService.produce({
    topic: 'test',
    messages: [
      {
        value: 'Hello World',
      },
    ],
  });
  return 'Hello World!';
}
  getHello(): string {
    return 'Hello World!';
  }

  getHelloName(name: string): string {
    return `Hello ${name}!`;
  }

  async getHelloClient() {
    return this.client.send({ cmd: 'greeting' }, 'Progressive Coder');
  }

  async getHelloAsync() {
    const message = await this.client.send(
      { cmd: 'greeting-async' },
      'Progressive Coder'
    );
    return message;
  }

  async publishEvent() {
    this.client.emit('book-created', {
      bookName: 'The Way Of Kings',
      author: 'Brandon Sanderson',
    });
  }

  async getHelloRedisCache() {
    this.logger.log('App Service getHelloRedisCache');
    await this.redisCache.set('cached_item', { key: 32 });
//    await this.cacheManager.del('cached_item');
//    await this.cacheManager.reset();
    const cachedItem = await this.redisCache.get('cached_item');
    console.log(cachedItem);
    return 'Hello World!';
  }
}

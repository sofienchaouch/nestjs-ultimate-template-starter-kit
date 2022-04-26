import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { ProducerService } from './kafka/producer.service';
@Injectable()
export class AppService {
  constructor(
    @Inject('GREETING_SERVICE') private client: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly producerService: ProducerService
  ) /** @Inject('ITEM_MICROSERVICE') private readonly client: ClientProxy */ {}

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
    await this.cacheManager.set('cached_item', { key: 32 }, { ttl: 10 });
    await this.cacheManager.del('cached_item');
    await this.cacheManager.reset();
    const cachedItem = await this.cacheManager.get('cached_item');
    console.log(cachedItem);
    return 'Hello World!';
  }
}

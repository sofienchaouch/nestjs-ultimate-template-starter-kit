import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER],
  });

  async onModuleInit() {
    await this.producer.connect();
  }

  private readonly producer: Producer = this.kafka.producer();
  private readonly logger = new Logger(ProducerService.name);

  async produce(record: ProducerRecord) {
    this.logger.log('Kafka Produce');
    this.logger.log(record);

    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}

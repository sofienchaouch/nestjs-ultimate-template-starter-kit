import { Logger } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  private readonly logger = new Logger(AppResolver.name);

  @Query(() => String)
  helloWorld(): string {
    this.logger.log('querry');

    return 'Hello World!';
  }
  @Query(() => String)
  hello(@Args('name') name: string): string {
    return `Hello ${name}!`;
  }
}

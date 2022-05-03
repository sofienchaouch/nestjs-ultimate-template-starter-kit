import { Logger } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { AllowAnyRole, Resource, Roles } from 'nest-keycloak-connect-graphql';

@Resolver()
export class AppResolver {
  private readonly logger = new Logger(AppResolver.name);

  @Query(() => String)
  helloWorld(): string {
    this.logger.log('querry');

    return 'Hello World!';
  }

  @Roles('master:admin', 'myrealm:admin', 'admin')
  @Query(() => String)
  hello(@Args('name') name: string): string {
    return `Hello ${name}!`;
  }
}

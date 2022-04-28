import { GraphQLModule } from '@nestjs/graphql';
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';
import config from 'src/common/configs/config';
import { loggingMiddleware } from 'src/common/middleware/logging.middleware';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlConfigService } from './gql-config.service';
import { UsersService } from './users/users.service';
import * as redisStore from 'cache-manager-redis-store';

import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from './kafka/kafka.module';
import { TestConsumer } from './test.consumer';
import { HeroModule } from './hero/hero.module';
import { EventsModule } from './websocketio/websocketio.module';
import { PrismaService } from './prisma.service';
import { RedisCacheModule } from './redis/redis.module';

@Module({
  imports: [
    EventsModule,
    HeroModule,
    KafkaModule,
    RedisCacheModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware()], // configure your prisma middleware
      },
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    AuthModule,
    UsersModule,
    PostsModule,

    // Keycloak Register
    KeycloakConnectModule.register({
      authServerUrl: process.env.AUTHSERVERURL,
      realm: process.env.REALM,
      clientId: process.env.CLEINTID,
      secret: process.env.SECRET,
      // Secret key of the client taken from keycloak server
    }),


    // Redis Client
    ClientsModule.register([
      {
        name: 'GREETING_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:6379',
        },
      },

      /* Microservice  Client TCP Connection      
    ClientsModule.register([{ name: 'ITEM_MICROSERVICE', transport: Transport.TCP }]),    
    */

      /*
      Kafka Registration 2nd Choice
      {
        name: 'HERO_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'hero',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'hero-consumer'
          }
        }
      }
      */
    ]),

    
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    TestConsumer,
    AppService,
    AppResolver,

    // KeyCloack
    // This adds a global level authentication guard,
    // you can also have it scoped
    // if you like.
    //
    // Will return a 401 unauthorized when it is unable to
    // verify the JWT token or Bearer header is missing.

    /*
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    */
    // This adds a global level resource guard, which is permissive.
    // Only controllers annotated with @Resource and
    // methods with @Scopes
    // are handled by this guard.

    /*
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    */

    // New in 1.1.0
    // This adds a global level role guard, which is permissive.
    // Used by `@Roles` decorator with the
    // optional `@AllowAnyRole` decorator for allowing any
    // specified role passed.

    /*
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    */
  ],
})
export class AppModule {}

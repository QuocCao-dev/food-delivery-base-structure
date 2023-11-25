// import { CacheModule } from '@nestjs/cache-manager';
import {
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule /* , ConfigService*/ } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
// import * as redisStore from 'cache-manager-redis-store';
import config from 'src/config';
import { DatabaseModule } from 'src/database/database.module';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggerService } from './logger/logger.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    DatabaseModule,
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     const username = configService.get('redis.username');
    //     const password = configService.get('redis.password');
    //     return {
    //       isGlobal: true,
    //       store: redisStore,
    //       host: configService.get('redis.host'),
    //       port: configService.get('redis.port'),
    //       ...(username && { username }),
    //       ...(password && { password }),
    //       no_ready_check: true,
    //       ttl: 10,
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
    LoggerService,
  ],
  exports: [LoggerService],
})
export class CoreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

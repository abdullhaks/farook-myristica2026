import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegistrationModule } from './registration/registration.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // Load environment variables from .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Connect to MongoDB using the mongo_url environment variable
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongo_url'),
      }),
    }),
    // Global rate limiter configuration: max 5 requests per minute (60 seconds)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    RegistrationModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Bind the rate limiter (ThrottlerGuard) globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

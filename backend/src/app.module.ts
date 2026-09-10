import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BuildingsModule } from './buildings/buildings.module';
import { FloorsModule } from './floors/floors.module';
import { SidesModule } from './sides/sides.module';
import { RoomsModule } from './rooms/rooms.module';
import { LecturersModule } from './lecturers/lecturers.module';
import { ModulesModule } from './modules/modules.module';
import { DisplayConfigurationsModule } from './display-configurations/display-configurations.module';
import { SessionsModule } from './sessions/sessions.module';
import { SignageModule } from './signage/signage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3001),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().default('8h'),
        FRONTEND_URL: Joi.string().default('http://localhost:3000'),
        APP_TIMEZONE: Joi.string().default('Asia/Colombo'),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    BuildingsModule,
    FloorsModule,
    SidesModule,
    RoomsModule,
    LecturersModule,
    ModulesModule,
    DisplayConfigurationsModule,
    SessionsModule,
    SignageModule,
  ],
})
export class AppModule {}

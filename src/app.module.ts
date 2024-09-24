import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dabatabseConfig from './config/database.config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dabatabseConfig],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}

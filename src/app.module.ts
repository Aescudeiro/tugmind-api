import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import dabatabseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dabatabseConfig],
    }),
  ],
})
export class AppModule {}

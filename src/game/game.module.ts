import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { RoomManager } from '../rooms/room-manager';
import { RoomsService } from 'src/rooms/rooms.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [],
  providers: [GameGateway, RoomManager, RoomsService, UsersService],
})
export class GameModule {}

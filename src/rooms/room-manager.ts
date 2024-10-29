import { Server } from 'socket.io';
import {
  AuthenticatedSocket,
  ServerEvents,
  ServerPayloads,
} from '../game/types';
import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room } from './entities/room-ws.entity';
import { ROOM_MAX_LIFETIME } from '../game/constants/constants';

@Injectable()
export class RoomManager {
  public server: Server;

  constructor(private readonly roomsService: RoomsService) {}

  private readonly rooms: Map<Room['id'], Room> = new Map<Room['id'], Room>();

  public initializeSocket(client: AuthenticatedSocket): void {
    client.data.room = null;
  }

  public terminateSocket(client: AuthenticatedSocket): void {
    client.data.room?.removeClient(client);
  }

  public async createRoom(
    client: AuthenticatedSocket,
    name: string,
  ): Promise<Room> {
    const roomData = await this.roomsService.create(client.data.userId, {
      name,
    });

    const room = new Room(this.server, roomData);

    this.rooms.set(room.id, room);

    return room;
  }

  public async joinRoom(
    roomId: string,
    client: AuthenticatedSocket,
  ): Promise<void> {
    let room = this.rooms.get(roomId);

    if (!room) {
      const roomInDb = await this.roomsService.findOne(roomId);

      if (!roomInDb) {
        throw new Error('Room not found');
      }

      room = new Room(this.server, roomInDb);
      this.rooms.set(room.id, room);
    }

    room.addClient(client);
  }

  public async leaveRoom(client: AuthenticatedSocket): Promise<void> {
    const room = client.data.room;

    if (room) {
      room.removeClient(client);

      if (room.isEmpty()) {
        this.rooms.delete(room.id);
      }
    }
  }

  @Cron('*/5 * * * *')
  private roomsCleaner(): void {
    for (const [, room] of this.rooms) {
      const now = new Date().getTime();
      const roomCreatedAt = room.createdAt.getTime();
      const roomLifetime = now - roomCreatedAt;

      if (roomLifetime > ROOM_MAX_LIFETIME) {
        room.dispatchToRoom<ServerPayloads[ServerEvents.GameMessage]>(
          ServerEvents.GameMessage,
          {
            color: 'blue',
            message: 'Game timed out',
          },
        );

        room.instance.triggerFinish();

        this.rooms.delete(room.id);
      }
    }
  }
}

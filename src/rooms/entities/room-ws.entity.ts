import { Server } from 'socket.io';
import {
  AuthenticatedSocket,
  ServerEvents,
  ServerPayloads,
} from '../../game/types';
import { Room as RoomModel } from '@prisma/client';
import { Instance } from '../../game/instance/instance';

export class Room implements RoomModel {
  private clients: Map<string, AuthenticatedSocket> = new Map();
  public createdAt: Date;
  public id: string;
  public name: string;
  public updatedAt: Date;
  public ownerId: string;

  public readonly instance: Instance = new Instance(this);

  constructor(
    readonly server: Server,
    readonly roomData: RoomModel,
  ) {
    this.id = roomData.id;
    this.name = roomData.name;
    this.createdAt = roomData.createdAt;
    this.updatedAt = roomData.updatedAt;
    this.ownerId = roomData.ownerId;
  }

  addClient(client: AuthenticatedSocket): void {
    this.clients.set(client.id, client);

    client.join(this.id);

    client.data.room = this;

    this.dispatchToRoom<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'green',
        message: 'Opponent joined room',
      },
    );

    this.dispatchRoomState();
  }

  removeClient(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);

    client.leave(this.id);

    client.data.room = null;

    this.dispatchToRoom<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Opponent left room',
      },
    );

    this.dispatchRoomState();
  }

  public dispatchRoomState(): void {
    const payload: ServerPayloads[ServerEvents.RoomState] = {
      roomId: this.id,
      roomName: this.name,
      hasStarted: this.instance.hasStarted,
      hasFinished: this.instance.hasFinished,
      isSuspended: this.instance.isSuspended,
      currentRound: this.instance.currentRound,
    };

    this.dispatchToRoom(ServerEvents.RoomState, payload);
  }

  public dispatchToRoom<T>(event: ServerEvents, payload: T): void {
    this.server.to(this.id).emit(event, payload);
  }

  public isEmpty(): boolean {
    return this.clients.size === 0;
  }
}

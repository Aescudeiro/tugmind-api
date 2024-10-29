import { Socket } from 'socket.io';
import { Room } from '../rooms/entities/room-ws.entity';

export enum ServerEvents {
  Pong = 'server.pong',

  GameMessage = 'server.gameMessage',

  RoomState = 'server.roomState',
}

export enum ClientEvents {
  Ping = 'client.ping',

  RoomCreate = 'client.roomCreate',
  RoomJoin = 'client.roomJoin',
  RoomLeave = 'client.roomLeave',
}

export type ServerPayloads = {
  [ServerEvents.Pong]: {
    message: string;
  };

  [ServerEvents.GameMessage]: {
    message: string;
    color?: 'green' | 'red' | 'blue' | 'orange';
  };

  [ServerEvents.RoomState]: {
    roomId: string;
    roomName: string;
    hasStarted: boolean;
    hasFinished: boolean;
    isSuspended: boolean;
    currentRound: number;
  };
};

export type AuthenticatedSocket = Socket & {
  data: {
    room: null | Room;
  };

  emit: <T>(ev: ServerEvents, data: T) => boolean;
};

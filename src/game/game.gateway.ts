import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto } from 'src/rooms/dto/create-room.dto';
import { RoomManager } from '../rooms/room-manager';
import {
  AuthenticatedSocket,
  ClientEvents,
  ServerEvents,
  ServerPayloads,
} from './types';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  path: '/wsapi',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateway.name);

  constructor(
    private readonly roomManager: RoomManager,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  afterInit(server: Server): any {
    this.roomManager.server = server;

    this.logger.log('Game server initialized !');
  }

  async handleConnection(client: Socket): Promise<void> {
    const decodedToken = await this.authService.verifyJwt(
      client.handshake.auth.token,
    );

    const user = await this.usersService.findOne(decodedToken.sub);

    client.data.userId = user.id;

    this.roomManager.initializeSocket(client as AuthenticatedSocket);
  }

  async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
    this.roomManager.terminateSocket(client);
  }

  @SubscribeMessage(ClientEvents.Ping)
  onPing(client: Socket): void {
    client.emit(ServerEvents.Pong, {
      message: 'pong',
    });
  }

  @SubscribeMessage(ClientEvents.RoomCreate)
  async onRoomCreate(
    client: AuthenticatedSocket,
    data: CreateRoomDto,
  ): Promise<WsResponse<ServerPayloads[ServerEvents.GameMessage]>> {
    const room = await this.roomManager.createRoom(client, data.name);

    return {
      event: ServerEvents.GameMessage,
      data: {
        color: 'green',
        message: `Room ${room.name} created`,
      },
    };
  }

  @SubscribeMessage(ClientEvents.RoomJoin)
  async onRoomJoin(
    client: AuthenticatedSocket,
    data: { roomId: string },
  ): Promise<void> {
    await this.roomManager.joinRoom(data.roomId, client);
  }

  @SubscribeMessage(ClientEvents.RoomLeave)
  async onRoomLeave(client: AuthenticatedSocket): Promise<void> {
    await this.roomManager.leaveRoom(client);
  }
}

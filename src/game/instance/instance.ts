import { Room } from '../../rooms/entities/room-ws.entity';
import { ServerEvents, ServerPayloads } from '../types';

export class Instance {
  public hasStarted = false;
  public hasFinished = false;
  public isSuspended = false;
  public currentRound = 1;

  constructor(private readonly room: Room) {}

  public triggerStart(): void {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;

    this.room.dispatchToRoom<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Game started !',
      },
    );
  }

  public triggerFinish(): void {
    if (this.hasFinished || !this.hasStarted) {
      return;
    }

    this.hasFinished = true;

    this.room.dispatchToRoom<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Game finished !',
      },
    );
  }
}

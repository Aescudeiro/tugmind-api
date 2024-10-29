import { ApiProperty } from '@nestjs/swagger';
import { Room } from '@prisma/client';

export class RoomEntity implements Room {
  constructor(partial: Partial<RoomEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  ownerId: string;
}

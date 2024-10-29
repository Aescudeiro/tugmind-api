import { ForbiddenException, Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsSearchParamsDto } from './dto/rooms-search-params.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createRoomDto: CreateRoomDto): Promise<Room> {
    const existingRoom = await this.prisma.room.findFirst({
      where: { ownerId: userId },
    });

    if (existingRoom) {
      throw new ForbiddenException('User already has a room.');
    }

    return await this.prisma.room.create({
      data: {
        ...createRoomDto,
        ownerId: userId,
      },
    });
  }

  async findAll(params: RoomsSearchParamsDto): Promise<Room[]> {
    return await this.prisma.room.findMany({
      where: {
        name: {
          contains: params.name,
          mode: 'insensitive',
        },
      },
    });
  }

  async findOne(id: string): Promise<Room> {
    return await this.prisma.room.findUnique({ where: { id } });
  }

  async update(
    userId: string,
    roomId: string,
    updateRoomDto: UpdateRoomDto,
  ): Promise<Room> {
    const room = await this.findOne(roomId);

    if (room.ownerId !== userId) {
      throw new ForbiddenException("User can't update this room.");
    }

    return await this.prisma.room.update({
      where: { id: roomId },
      data: updateRoomDto,
    });
  }

  async remove(userId: string, roomId: string): Promise<Room> {
    const room = await this.findOne(roomId);

    if (room.ownerId !== userId) {
      throw new ForbiddenException("User can't delete this room.");
    }

    return await this.prisma.room.delete({ where: { id: roomId } });
  }
}

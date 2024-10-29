import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsSearchParamsDto } from './dto/rooms-search-params.dto';
import { RoomEntity } from './entities/room.entity';
import { RoomsService } from './rooms.service';

@Controller('rooms')
@ApiTags('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: RoomEntity })
  async create(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    return new RoomEntity(
      await this.roomsService.create(req.user.id, createRoomDto),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: RoomEntity, isArray: true })
  async findAll(@Query() params: RoomsSearchParamsDto) {
    const rooms = await this.roomsService.findAll(params);

    return rooms.map((room) => new RoomEntity(room));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: RoomEntity })
  async findOne(@Param('id') id: string) {
    return new RoomEntity(await this.roomsService.findOne(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: RoomEntity })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateRoomDto: CreateRoomDto,
  ) {
    return new RoomEntity(
      await this.roomsService.update(req.user.id, id, updateRoomDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: RoomEntity })
  async remove(@Request() req, @Param('id') id: string) {
    return new RoomEntity(await this.roomsService.remove(req.user.id, id));
  }
}

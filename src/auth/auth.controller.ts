import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entities/auth.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Get('me')
  @ApiOkResponse({ type: UserEntity })
  async me(@Request() req) {
    if (!req.user) {
      throw new ForbiddenException();
    }

    return new UserEntity(req.user);
  }
}

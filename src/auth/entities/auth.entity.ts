import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class AuthEntity extends UserEntity {
  @ApiProperty()
  accessToken: string;

  constructor(partial: Partial<AuthEntity>) {
    super(partial);

    Object.assign(this, partial);
  }
}

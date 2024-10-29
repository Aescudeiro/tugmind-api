import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoomsSearchParamsDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;
}

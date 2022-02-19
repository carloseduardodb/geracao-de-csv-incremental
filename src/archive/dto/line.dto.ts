import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class LineDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}

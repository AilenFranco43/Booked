import { IsString, IsNotEmpty, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: '6710567b8c62da71492c4ca4', description: 'ID de la propiedad que se está calificando', required: true })
  @IsString()
  @IsNotEmpty()
  property: string;

  @ApiProperty({ example: '6710567b8c62da71492c4ca4', description: 'id de user', required: true })
  @IsString()
  @IsNotEmpty()
  guest: string;

  @ApiProperty({ example: 5, description: 'Rating', required: true })
  @IsNumber()
  @IsOptional()
  rating: number;

  @ApiProperty({ example: 'Great place', description: 'Comment', required: true })
  @IsString()
  @IsOptional()
  comment: string;
  
}
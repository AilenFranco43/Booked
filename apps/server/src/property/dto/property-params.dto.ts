import { IsString, IsNumber, IsArray, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

type Orders = 'ASC' | 'DES';

export class PropertyParamsDto {
  @ApiPropertyOptional({
    example: 'Beach House',
    description: 'Title of property to search',
  })
  @IsOptional()
  @IsString()
  title: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  minPrice: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxPrice: number;

  @ApiPropertyOptional({
    example: ['wifi', 'pool'],
    description: 'List of tags to search',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  tags: string[];

  @ApiPropertyOptional({
    example: 'ASC',
    description: 'The order of results must be ASC or DES',
    enum: ['ASC', 'DES'],
  })
  @IsIn(['ASC', 'DES'])
  @IsOptional()
  orderBy: Orders;

  @ApiPropertyOptional({
    example: '5886, Soler, Palermo Hollywood, Buenos Aires, Argentina',
    description: 'The address must be detailed',
  })
  @IsOptional()
  @IsString()
  address: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  min_people: number;

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort by average rating (asc or desc)',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByRating?: 'asc' | 'desc';
}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  ArrayMinSize,
  IsUrl,
  Min,
  IsObject,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class Coordinates {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class CreatePropertyDto {
  @ApiProperty({
    example: 'Beautiful Beach House',
    description: 'Title of the property',
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: 'A lovely house near the beach with all amenities included.',
    description: 'Description of the property',
  })
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: 150,
    description: 'Price per night of the property',
  })
  @Type(() => Number)
  @IsNumber()
  readonly price: number;

  @ApiPropertyOptional({
    example: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
      'https://example.com/photo3.jpg',
    ],
    description: 'Property photo URLs. Must include at least 3 photos.',
  })
  @IsOptional()
  @ArrayMinSize(1)
  @IsUrl({}, { each: true })
  readonly photos: string[];

  @ApiProperty({
    example: 4,
    description: 'Maximum number of people that can stay in the property',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly max_people: number;

  @ApiPropertyOptional({
    example: ['beachfront', 'wifi', 'pets allowed'],
    description: 'Optional tags that describe the property',
  })
  @IsOptional()
  @ValidateIf(o => Array.isArray(o.tags) || typeof o.tags === 'string')
  @IsArray()
  @IsString({ each: true })
  readonly tags?: string[];

  @ApiProperty({
    example: '123 Calle Principal, Ciudad, Provincia',
    description: 'Address of the property',
  })
  @IsString()
  readonly address: string;

  @ApiProperty({
    description: 'Coordinates of the property',
    type: Coordinates,
  })
  @ValidateNested()
  @Type(() => Coordinates)
  readonly coordinates: Coordinates;
}

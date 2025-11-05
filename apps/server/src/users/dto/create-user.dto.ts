import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '123456789', description: 'User mobile phone' })
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'User day of birth',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiProperty({
    example: 'Argentina',
    description: 'User nationality',
    required: false,
  })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/yourcloud/image/upload/v123456/avatar.jpg',
    description: 'User profile image URL',
    required: false, })
  @IsString()
  @IsOptional()
  avatar?: string;
}

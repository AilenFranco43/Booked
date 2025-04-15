import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login success' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @ApiResponse({ status: 404, description: 'No users found' })
  @Get('all')
  async findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Returns a user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('user/:id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'User not actualized' })
  @Patch('patch/:id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

    console.log('Body recibido:', updateUserDto); 
    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'Deleted user successfully' })
  @ApiResponse({ status: 404, description: 'User not deleted' })
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { Model } from 'mongoose';
import { LoginUserDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; token: string }> {
    const { name, email, password, mobileNumber, birthDate, nationality, avatar } =
      createUserDto;
    const emailToLowerCase = email.toLowerCase();
    const existingUser = await this.userModel.findOne({
      email: emailToLowerCase,
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      name,
      email: emailToLowerCase,
      password: hashedPassword,
      mobileNumber,
      birthDate,
      nationality,
      avatar,
    });

    const token = this.generateJwt({ id: newUser.id });

    return {
      user: newUser,
      token,
    };
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user)
      throw new NotFoundException(`User with email ${email} not exists`);

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const emailToLowerCase = email.toLowerCase();

    const user = await this.findOneByEmail(emailToLowerCase);

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch)
      throw new UnauthorizedException('Email or password incorrect');

    const token = this.generateJwt({ id: user.id });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        birthDate: user.birthDate,
        nationality: user.nationality,
        avatar: user.avatar,
      },
      token,
    };
  }

  private generateJwt(data: { id: string }): string {
    const token = this.jwtService.sign(data);
    return token;
  }
}

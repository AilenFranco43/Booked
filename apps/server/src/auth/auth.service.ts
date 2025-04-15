import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) { }

  checkAuthStatus(user: User) {
    const { name, email, id, mobileNumber, birthDate, nationality, avatar } = user;

    return {
      user: { id, name, email, mobileNumber, birthDate, nationality, avatar },
      token: this.generateJwt({ id: user.id }),
    };
  }

  private generateJwt(data: { id: string }): string {
    const token = this.jwtService.sign(data);
    return token;
  }
}

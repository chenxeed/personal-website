import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(pass: string) {
    if (process.env.ADMIN_SECRET !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { admin: true };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}

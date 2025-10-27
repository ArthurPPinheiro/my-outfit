import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwtService: JwtService
    ) {}

    async login(data: LoginDto) {
        const user = await this.prisma.user.findUnique({
          where: { 
            email: data.email
          }
        });
    
        if (!user) {
          throw new NotFoundException(`User not found`);
        }
        
        const passwordIsValid = await bcrypt.compare(data.password, user.passwordHash);
        
        if (!passwordIsValid) {
          throw new UnauthorizedException(`Invalid credentials`);
        }
    
         return {
            accessToken: this.jwtService.sign({ userId: user.id }),
        };
    
      }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async authenticate(input: LoginDTO): Promise<any> {
        const user = await this.validateUser(input);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            message: 'Login successful',
            accessToken: this.jwtService.sign({ userId: user.id, email: user.email }),
            userId: user.id,
            email: user.email
        };
    }

    async validateUser(input: LoginDTO): Promise<any> {
        const user = await this.usersService.findByEmail(input.email);

        if (user && await bcrypt.compare(input.password, user.password)) {
            return user;
        }

        return null;
    }
}

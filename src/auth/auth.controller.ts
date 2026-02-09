import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDTO: LoginDTO) {
        return this.authService.authenticate(loginDTO);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('me')
    getUserInfo( @Request() request ) {
        return { message: 'This is a protected route', user: request.user };
    }

}

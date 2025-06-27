import { Controller, Post, Body, Get, Query, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserLoginDto } from './dto/user-login.dto';
import * as jwt from 'jsonwebtoken';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('signup')
    async signup(@Body() dto: UserSignupDto) {
        return this.userService.signup(dto);
    }

    @Post('login')
    async login(@Body() dto: UserLoginDto) {
        return this.userService.login(dto);
    }

    @Post('logout')
    @ApiBearerAuth()
    async logout(@Body('userId') userId: string) {
        return this.userService.logout(userId);
    }

    @Get('getAllUser')
    async getAllUser(@Query('token') token: string) {
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            if (decoded.role !== 'admin') {
                throw new UnauthorizedException('Only admin can access this resource');
            }
            return this.userService.findAll();
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
// 
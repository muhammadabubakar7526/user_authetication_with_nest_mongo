import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserSignupDto } from './dto/user-signup.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRole, UserUpdateDto } from './types';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async signup(dto: UserSignupDto) {
        const { email, password, name } = dto;
        const existing = await this.userModel.findOne({ email });
        if (existing) throw new ConflictException('Email already in use');
        const hash = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({ email, password: hash, name, role: 'user' });
        const obj = user.toObject() as User & { _id: Types.ObjectId };
        const { password: _, ...result } = obj;
        return { ...result, _id: obj._id.toString() };
    }
    async login(dto: UserLoginDto) {
        const { email, password } = dto;
        const user = await this.userModel.findOne({ email }).lean<User & { _id: Types.ObjectId }>();
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');
        const token = sign(
            { sub: user._id.toString(), email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );
        return {
            access_token: token,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }
    async logout(userId: string) {
        // JWT is stateless; logout should be handled on client by deleting token
        return { message: 'Logged out (client should delete token)' };
    }
    async findAll() {
        const users = await this.userModel.find().select('-password');
        return users;
    }
    async findOne(id: string) {
        const user = await this.userModel.findById(id).select('-password');
        return user;
    }
    async update(id: string, dto: UserUpdateDto) {
        // Never allow password update here
        if ('password' in dto) delete dto.password;
        const user = await this.userModel.findByIdAndUpdate(id, dto, { new: true }).lean<User & { _id: Types.ObjectId }>();
        if (!user) return null;
        const { password: _removed, ...result } = user;
        return { ...result, _id: user._id.toString() };
    }
    async remove(id: string) {
        return this.userModel.findByIdAndDelete(id);
    }
}

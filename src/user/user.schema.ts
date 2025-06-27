import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserRole = 'user' | 'admin';

@Schema({ timestamps: true })
export class User extends Document {
    @ApiProperty({ example: 'user@example.com' })
    @Prop({ required: true, unique: true })
    email: string;

    @ApiProperty({ example: 'password123' })
    @Prop({ required: true })
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @Prop()
    name: string;

    @ApiProperty({ example: 'user', enum: ['user', 'admin'], default: 'user' })
    @Prop({ default: 'user' })
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User); 
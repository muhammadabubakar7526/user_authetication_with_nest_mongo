import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export type UserRole = 'user' | 'admin';

@Entity('users')
export class UserEntity {
    @ApiProperty({ example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'user@example.com' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ example: 'password123' })
    @Column()
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @Column({ nullable: true })
    name: string;

    @ApiProperty({ example: 'user', enum: ['user', 'admin'], default: 'user' })
    @Column({ default: 'user' })
    role: UserRole;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    @UpdateDateColumn()
    updatedAt: Date;
} 
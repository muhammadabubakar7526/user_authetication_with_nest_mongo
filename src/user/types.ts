export type UserRole = 'user' | 'admin';

export interface UserUpdateDto {
    email?: string;
    name?: string;
    role?: UserRole;
} 
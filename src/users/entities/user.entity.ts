import { User } from '@prisma/client';

export class UserEntity implements User{
    id: string;
    email: string;
    username: string
    passwordHash: string;
    fullName: string;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null
}

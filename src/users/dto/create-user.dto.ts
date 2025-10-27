export class CreateUserDto {
    email: string;
    username: string
    password: string;
    fullName: string;
    avatarUrl?: string | null;
}

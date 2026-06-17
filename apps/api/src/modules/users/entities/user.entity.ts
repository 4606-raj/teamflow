import { User } from "@prisma/client";

type SafeUser = Omit<User, 'password' | 'refreshTokenHash'> & Partial<Pick<User, 'password' | 'refreshTokenHash'>>;

export class UserEntity {
    id!: string;
    email!: string;
    firstName!: string | null;
    lastName!: string | null;
    isActive!: boolean;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(user: SafeUser) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.isActive = user.isActive;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}
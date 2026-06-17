import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async create(data: CreateUserDto) {
        
        const existingUser = await this.usersRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }
        
        // hashing password before saving to DB
        data.password = await bcrypt.hash(data.password, 10);
        
        const user = await this.usersRepository.create(data);

        return new UserEntity(user);
    }

    async findByEmail(email: string) {
        return this.usersRepository.findByEmail(email);
    }

    async findById(id: string) {
        return this.usersRepository.findById(id);
    }

    async updateRefreshToken(userId: string, refreshToken: string | null) {
        // hash the refresh token before storing it in the DB
        const hash = refreshToken !== null? await bcrypt.hash(refreshToken, 10): null;
        
        await this.usersRepository.updateRefreshToken(userId, hash);
    }
}

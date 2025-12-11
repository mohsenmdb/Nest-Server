import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    findAll = async() => {
        return await this.userRepository.find();
    }

    createUser() {
        const user = this.userRepository.create({
            firs_name: 'Mohsen',
            last_name: 'Moradtalab',
            email: 'mohsen@test.com',
            password: 'mypassword',
        });
        this.userRepository.save(user);  
    }
}

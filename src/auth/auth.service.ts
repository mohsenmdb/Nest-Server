import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
  ) { }


  async register(registerDto: RegisterDto) {
    const user = await this.userService.findOneByEmail(registerDto.email);
    if (user) {
      throw new HttpException('User with this email already exists', 400);
    }

    registerDto.password = bcrypt.hashSync(registerDto.password, 8);
    return await this.userService.createUser(registerDto);

  }
  login(loginDto: LoginDto) {
    return 'This action adds a new auth';
  }
}

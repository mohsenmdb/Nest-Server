import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginByOtpDto, LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import bcrypt from 'node_modules/bcryptjs';
import { JwtService } from '@nestjs/jwt';
import Codes from 'src/otp/codes.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Codes)
    private readonly codesRepository: Repository<Codes>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }


  async register(registerDto: RegisterDto) {
    const user = await this.userService.findOneByEmail(registerDto.email);
    if (user) {
      throw new HttpException('User with this email already exists', 400);
    }

    registerDto.password = bcrypt.hashSync(registerDto.password, 8);
    return await this.userService.createUser(registerDto);

  }
  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmailWithPassword(loginDto.email);
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    console.log(`User password: ${user.password}, Login password: ${loginDto.password}`);
    const isPasswordValid = bcrypt.compareSync(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', 400);
    }
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { accessToken: accessToken };
  }

  async loginByOtp(loginDto: LoginByOtpDto) {
    const user = await this.userService.findOneByEmailWithPassword(loginDto.email);
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    if (loginDto.code) {
      const checkOtp = await this.codesRepository.findOne({
        where: {
          code: loginDto.code,
          email: loginDto.email,
          is_used: false
        }
      })
      if (!checkOtp) {
        throw new HttpException('Opt is invalid', 400);
      }
      this.codesRepository.update(checkOtp, {is_used: true})
      const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
      return { accessToken: accessToken };
    } else {
      const otp = await this.generateOtpCode()
      this.codesRepository.save({ email: loginDto.email, code: otp })
      //todo send otp by email
      return { otp: otp };
    }
  }

  async generateOtpCode() {
    let code: number = 0;
    while (code === 0) {
      const fiveDigitCode = this.getRandomCode()
      const checkCode = await this.codesRepository.findOne({ where: { code: fiveDigitCode } })
      if (!checkCode) {
        code = fiveDigitCode;
        break;
      }
    }
    return code
  }

  getRandomCode() {
    const min = 10000;
    const max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

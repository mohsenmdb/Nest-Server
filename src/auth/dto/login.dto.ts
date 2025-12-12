import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}

export class LoginByOtpDto {
    @IsEmail()
    email: string;
    @IsOptional()
    code: number;
}
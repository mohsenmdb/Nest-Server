import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import UserGuards from "src/user/dto/userGuards";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    description: string;
    @IsNumber()
    @IsOptional()
    price: number;
    @IsOptional()
    user: UserGuards;
}

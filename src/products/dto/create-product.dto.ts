import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import UserGuards from "src/user/dto/userGuards";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'The title of the product',
        example: 'Awesome Product',
        default: ''
    })
    title: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @ApiProperty({
        description: 'The description of the product',
        example: 'This is an awesome product that does many great things.',
        minLength: 10,
    })
    description: string;
    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description: 'The price of the product',
        example: 99.99,

    })
    price: number;
    @IsOptional()
    user: UserGuards;
}

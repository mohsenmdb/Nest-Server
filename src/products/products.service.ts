import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Pruducts from './entities/products.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import UserGuards from 'src/user/dto/userGuards';

@Injectable()
export class ProductsService {
constructor(
  @InjectRepository(Pruducts)
  private readonly productRepository: Repository<Pruducts>,
) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct = await this.productRepository.save(createProductDto);
    return newProduct;
  }

  async findAll() {
    return await this.productRepository.find({relations: ['user'] });
  }

  async findOne(id: number) {
    const product =  await this.productRepository.findOne({
    where: { id },
    relations: ['user'],
  });
  if (!product) {
    throw new HttpException('Product not found', 404);
  }
  return product;
}

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.update(
      {id, user: updateProductDto.user}, 
      updateProductDto
    );
    if (product.affected === 0) {
      throw new HttpException('Product not found', 404);
    }
    return product;
  }

  async remove(id: number, user: UserGuards) {
    // return await this.productRepository.delete(id);
    const checkedProduct = await this.productRepository
    .createQueryBuilder('products')
    .leftJoinAndSelect('products.user', 'user')
    .where('products.id = :id', { id })
    .andWhere('products.user = :user', { user: user.id })
    .getOne();
    
    if (!checkedProduct) {
      throw new HttpException('Product not found or you are not authorized to delete this product', 404);
    }

    return await this.productRepository.delete(checkedProduct);
  }
}

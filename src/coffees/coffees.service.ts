import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isNil } from 'lodash';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}

  index(limit: number, offset: number) {
    if (
      limit === null ||
      limit === undefined ||
      offset === null ||
      offset === undefined
    )
      return [];
    const coffees = this.coffeeRepository.find();
    return coffees;
  }

  async show(id: number) {
    const coffee = await this.coffeeRepository.findOne(id);

    if (isNil(coffee)) {
      throw new HttpException(
        `Coffee ${id} is not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return coffee;
  }

  async create(body: CreateCoffeeDto) {
    const coffee = await this.coffeeRepository.create(body);
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, body: UpdateCoffeeDto) {
    const coffee = await this.coffeeRepository.preload({ id: +id, ...body });
    if (isNil(coffee)) {
      throw new NotFoundException(`Coffee ${id} not founed`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.coffeeRepository.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }
}

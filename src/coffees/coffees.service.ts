import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class CoffeesService {
  constructor(@InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>
  ){}
  
  index(limit: number, offset: number) {
    if (
      limit === null ||
      limit === undefined ||
      offset === null ||
      offset === undefined
    )
      return [];

    return this.coffeeRepository.
  }

  show(id: number) {
    const coffee = this.coffees.find((c) => c.id === id);

    if (isNil(coffee)) {
      throw new HttpException(
        `Coffee ${id} is not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return coffee;
  }

  create(body: CreateCoffeeDto) {
    const id = this.coffees.length;
    const coffee = { ...body, id };
    this.coffees.push(coffee);
    return coffee;
  }

  remove(id: number) {
    this.coffees = this.coffees.filter((c) => c.id !== id);
  }
  update(id: number, body: UpdateCoffeeDto) {
    this.coffees = this.coffees.map((c) => {
      if (c.id === id) {
        return { ...c, ...body };
      }
    });
  }
}

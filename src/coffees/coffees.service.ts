import { Flavor } from './entities/flavor.entity';
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
    @InjectRepository(Coffee)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

  async index(take: number, offset: number) {
    const coffees = await this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset || 0,
      take: take || 20,
    });
    return coffees;
  }

  async show(id: number) {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });

    if (isNil(coffee)) {
      throw new HttpException(
        `Coffee ${id} is not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return coffee;
  }

  async create(body: CreateCoffeeDto) {
    const flavors = await Promise.all(
      body.flavors.map(({ name }) => this.preloadFlavorByName(name)),
    );
    const coffee = await this.coffeeRepository.create({ ...body, flavors });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, body: UpdateCoffeeDto) {
    const flavors =
      !isNil(body.flavors) &&
      (await Promise.all(
        body.flavors.map(({ name }) => this.preloadFlavorByName(name)),
      ));
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...body,
      flavors,
    });
    if (isNil(coffee)) {
      throw new NotFoundException(`Coffee ${id} not founed`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.coffeeRepository.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (!isNil(existingFlavor)) return existingFlavor;
    return this.flavorRepository.create({ name });
  }
}

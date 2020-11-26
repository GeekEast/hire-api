import { Coffee } from './entities/coffee.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import data from 'data/data.json';
import { isNil } from 'lodash';
@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = data.coffees;

  index(limit: number, offset: number) {
    if (
      limit === null ||
      limit === undefined ||
      offset === null ||
      offset === undefined
    )
      return [];

    return this.coffees.slice(offset, offset + limit);
  }

  show(id: string) {
    const coffee = this.coffees.find((c) => c.id === parseInt(id));

    if (isNil(coffee)) {
      throw new HttpException(
        `Coffee ${id} is not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return coffee;
  }

  create(body: Coffee) {
    this.coffees.push(body);
  }

  remove(id: string) {
    this.coffees = this.coffees.filter((c) => c.id !== parseInt(id));
  }

  partial_update(id: string, body: Coffee) {
    this.coffees = this.coffees.map((c) => {
      if (c.id === parseInt(id)) {
        return { ...c, ...body };
      }
    });
  }

  update(id: string, body: Coffee) {
    this.coffees = this.coffees.map((c) => {
      if (c.id === parseInt(id)) {
        return body;
      }
    });
  }
}

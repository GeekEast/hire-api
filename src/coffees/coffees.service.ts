import { Coffee } from './entities/coffee.entity';
import { Injectable } from '@nestjs/common';
import data from 'data/data.json';

@Injectable()
export class CoffeesService {
  // private coffees: Coffee[] = generateSampleData();
  private coffees: Coffee[] = data.coffees;

  index(limit: number, offset: number) {
    console.log(this.coffees.length);
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
    return this.coffees.find((c) => c.id === parseInt(id));
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

import { IsArray, IsString } from 'class-validator';
import { Flavor } from 'coffees/entities/flavor.entity';

export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsArray()
  readonly flavors: Flavor[];
}

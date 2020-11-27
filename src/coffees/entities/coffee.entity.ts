import { Flavor } from './flavor.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('coffees')
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  @ManyToMany(() => Flavor, (flavor) => flavor.coffees, {
    cascade: true,
  })
  @JoinTable()
  flavors: Flavor[];
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('flavors')
export class Flavor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

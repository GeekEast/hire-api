import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1606519493960 implements MigrationInterface {
  name = 'CoffeeRefactor1606519493960';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffees" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "coffees" DROP COLUMN "description"`);
  }
}

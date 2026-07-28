import { MigrationInterface, QueryRunner } from "typeorm";

/** Repairs legacy size configurations created before their final prices were persisted. */
export class BackfillProductConfigurationPrices1710000014000 implements MigrationInterface {
  name = "BackfillProductConfigurationPrices1710000014000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE product_sizes AS product_size
      SET price = product.base_price + size.additional_price
      FROM products AS product, sizes AS size
      WHERE product_size.product_id = product.id
        AND product_size.size_id = size.id
        AND product_size.price = 0
        AND product.base_price > 0
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}

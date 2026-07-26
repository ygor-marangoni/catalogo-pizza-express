import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableColumn } from "typeorm";

export class CreateProductConfigurations1710000009000 implements MigrationInterface {
  name = "CreateProductConfigurations1710000009000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.ensureRelation(queryRunner, "product_sizes", "size_id", "sizes", [
      new TableColumn({ name: "price", type: "integer", default: "0" }),
      new TableColumn({ name: "is_default", type: "boolean", default: false }),
      new TableColumn({ name: "available", type: "boolean", default: true }),
    ]);
    await this.ensureRelation(queryRunner, "product_edges", "edge_id", "edges", [
      new TableColumn({ name: "price_override", type: "integer", isNullable: true }),
      new TableColumn({ name: "available", type: "boolean", default: true }),
    ]);
    await this.ensureRelation(queryRunner, "product_additionals", "additional_id", "additionals", [
      new TableColumn({ name: "price_override", type: "integer", isNullable: true }),
      new TableColumn({ name: "available", type: "boolean", default: true }),
    ]);

    for (const table of ["product_sizes", "product_edges", "product_additionals"]) {
      const indexName = `IDX_${table.toUpperCase()}_PRODUCT`;
      const tableInfo = await queryRunner.getTable(table);
      if (!tableInfo?.indices.some((index) => index.name === indexName))
        await queryRunner.createIndex(table, new TableIndex({ name: indexName, columnNames: ["product_id"] }));
    }
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_PRODUCT_SIZES_DEFAULT" ON "product_sizes" ("product_id") WHERE "is_default" = true`);
    await queryRunner.query(`
      UPDATE product_sizes ps SET price = p.base_price + s.additional_price
      FROM products p, sizes s WHERE ps.product_id = p.id AND ps.size_id = s.id AND ps.price = 0
    `);
    await queryRunner.query(`
      UPDATE product_sizes ps SET is_default = true
      WHERE ps.size_id = (SELECT link.size_id FROM product_sizes link JOIN sizes s ON s.id = link.size_id WHERE link.product_id = ps.product_id ORDER BY s.additional_price ASC, s.id ASC LIMIT 1)
        AND NOT EXISTS (SELECT 1 FROM product_sizes other WHERE other.product_id = ps.product_id AND other.is_default = true)
    `);
    await queryRunner.query(`
      INSERT INTO product_sizes (product_id, size_id, price, is_default, available)
      SELECT p.id, s.id, p.base_price + s.additional_price,
        s.id = (SELECT s2.id FROM sizes s2 WHERE s2.deleted_at IS NULL ORDER BY s2.additional_price ASC, s2.id ASC LIMIT 1), true
      FROM products p JOIN categories c ON c.id = p.category_id AND c.deleted_at IS NULL
      CROSS JOIN sizes s WHERE p.deleted_at IS NULL AND s.deleted_at IS NULL AND lower(c.name) LIKE '%pizza%'
      ON CONFLICT (product_id, size_id) DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO product_edges (product_id, edge_id, price_override, available)
      SELECT p.id, e.id, NULL, true FROM products p JOIN categories c ON c.id = p.category_id AND c.deleted_at IS NULL
      CROSS JOIN edges e WHERE p.deleted_at IS NULL AND e.deleted_at IS NULL AND lower(c.name) LIKE '%pizza%'
      ON CONFLICT (product_id, edge_id) DO NOTHING
    `);
    await queryRunner.query(`
      INSERT INTO product_additionals (product_id, additional_id, price_override, available)
      SELECT p.id, a.id, NULL, true FROM products p JOIN categories c ON c.id = p.category_id AND c.deleted_at IS NULL
      CROSS JOIN additionals a WHERE p.deleted_at IS NULL AND a.deleted_at IS NULL AND lower(c.name) LIKE '%pizza%'
      ON CONFLICT (product_id, additional_id) DO NOTHING
    `);
  }

  private async ensureRelation(queryRunner: QueryRunner, name: string, optionColumn: string, optionTable: string, columns: TableColumn[]) {
    if (!(await queryRunner.hasTable(name))) {
      await queryRunner.createTable(new Table({ name, columns: [
        { name: "product_id", type: "integer", isPrimary: true }, { name: optionColumn, type: "integer", isPrimary: true }, ...columns,
      ] }));
      await queryRunner.createForeignKey(name, new TableForeignKey({ columnNames: ["product_id"], referencedTableName: "products", referencedColumnNames: ["id"], onDelete: "CASCADE" }));
      await queryRunner.createForeignKey(name, new TableForeignKey({ columnNames: [optionColumn], referencedTableName: optionTable, referencedColumnNames: ["id"], onDelete: "CASCADE" }));
      return;
    }
    const table = await queryRunner.getTable(name);
    for (const column of columns) if (!table?.findColumnByName(column.name)) await queryRunner.addColumn(name, column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("product_additionals");
    await queryRunner.dropTable("product_edges");
    await queryRunner.dropTable("product_sizes");
  }
}

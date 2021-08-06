import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Products extends BaseSchema {
  protected tableName = 'products';

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });

      table.string('name').notNullable();

      table.float('direct_costs').notNullable();
      table.float('base_min_price').notNullable();
    });
  }

  public async down () {
    this.schema.dropTable(this.tableName);
  }
}

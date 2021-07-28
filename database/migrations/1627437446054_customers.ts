import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Customers extends BaseSchema {
  protected tableName = 'customers';

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });

      table.string('name').notNullable();
      table.string('segment').notNullable(); // PM varia com o segment

      table.string('localization').notNullable(); // ?
      table.string('latitude').notNullable(); // ?
      table.string('longitude').notNullable(); // ?

      table.float('sales_amount').notNullable(); // qnt maior, menor o PM
    });
  }

  public async down () {
    this.schema.dropTable(this.tableName);
  }
}

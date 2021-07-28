import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Sellers extends BaseSchema {
  protected tableName = 'sellers';

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });

      table.string('name').notNullable();

      table.float('xp_level').notNullable(); // 0 to 10, >= 7 (-PM) | < 7 (+PM)
    });
  }

  public async down () {
    this.schema.dropTable(this.tableName);
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Sellers extends BaseSchema {
  protected tableName = 'sellers';

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('cpf').unique().notNullable().primary();
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });

      table.string('name').notNullable();

      // 1. trainee, 2. junior, 3. mid, 4. senior, 5. specialist
      table.integer('xp_level').notNullable();
    });
  }

  public async down () {
    this.schema.dropTable(this.tableName);
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Negotiations extends BaseSchema {
  protected tableName = 'negotiations';

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });

      table.boolean('is_closed').notNullable();

      table.float('negotiated_price');

      // customer_id long [ref: - customer.id] (many-to-one)
      table
        .integer('customer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('customers')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      
      // product_id long [ref: - product.id] (many-to-one)
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    
      // seller_id long [ref: - seller.cpf] (many-to-one)
      table
        .string('seller_cpf')
        .notNullable()
        .references('cpf')
        .inTable('sellers')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName);
  }
}

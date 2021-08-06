import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';

import Customer from './Customer';
import Product from './Product';
import Seller from './Seller';

export default class Negotiation extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column()
  public isClosed: boolean;

  @column()
  public negotiatedPrice: number;

  // Foreign Keys
  @column()
  public customerId: number;

  @column()
  public productId: number;

  @column()
  public sellerCpf: number;

  // Relationships
  @belongsTo(() => Customer)
  public customer: BelongsTo<typeof Customer>;

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>;

  @belongsTo(() => Seller)
  public seller: BelongsTo<typeof Seller>;
}

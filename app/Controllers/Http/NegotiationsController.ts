import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Customer from '../../Models/Customer';
import Product from '../../Models/Product';
import Negotiation from '../../Models/Negotiation';

import getDistance from 'geolib/es/getDistance';

export default class NegotiationsController {

  public async index({}: HttpContextContract) {
    return await Negotiation.all();
  }

  public async store({ request }: HttpContextContract): Promise<Negotiation> {
    const data = request.body();

    return await Negotiation.create(data);
  }

  public async show({ params }: HttpContextContract): Promise<Negotiation> {
    return await Negotiation.findOrFail(params.id);
  }

  public async update({ request, params }: HttpContextContract): Promise<Negotiation> {
    const negotiation = await Negotiation.findOrFail(params.id);
    const data = request.body();

    negotiation.merge(data);
    await negotiation.save();

    return negotiation;
  }

  public async destroy({ params }: HttpContextContract): Promise<void> {
    const negotiation = await Negotiation.findOrFail(params.id);

    await negotiation.delete();
  }

  public async validatePrice({ request, params, response }: HttpContextContract): Promise<void> {
    const price = parseInt(request.input('price'));

    const negotiation = await Negotiation.query()
      .where('id', params.id)
      .preload('customer')
      .preload('product')
      .preload('seller')
      .firstOrFail();

    const totalDiscount = await this.getTotalDiscount(negotiation);

    const newMinPrice = negotiation.product.baseMinPrice * (1 + totalDiscount);

    const comparative =
      price > newMinPrice ? 'higher than' : (price === newMinPrice ? 'equals to' : 'lower than');
    const message = `The requested price is ${comparative} the minimum allowable selling price`;

    response.ok({ requested_price: price, minimum_price: newMinPrice, message });
  }

  private async getTotalDiscount({ customer, product, seller }: Negotiation): Promise<number> {
    let totalDiscount: number = 0;

    // Sales amount (BRL)
    totalDiscount += await this.getDiscountByCustomerSalesAmount(customer.salesAmount);
    
    // Customer segment
    totalDiscount += this.getDiscountByCustomerSegment(customer.segment);

    // Customer localization
    const { latitude, longitude } = customer;
    totalDiscount += await this.getDiscountByCustomerLocalization({ latitude, longitude }, product);

    // Seller type (experience level)
    totalDiscount += await this.getDiscountBySellerExpLevel(seller.xpLevel);

    return totalDiscount;
  }

  private async getDiscountByCustomerSalesAmount(salesAmount: number): Promise<number> {        
    const [minAmountCustomer] = await Customer.query().min('sales_amount as min_amount');
    const [maxAmountCustomer] = await Customer.query().max('sales_amount as max_amount');

    const minAmount = minAmountCustomer.$extras.min_amount;
    const maxAmount = maxAmountCustomer.$extras.max_amount;

    return this.normalizeValue(salesAmount, minAmount, maxAmount) * (-1);
  }

  private async getDiscountBySellerExpLevel(sellerExpLevel: number): Promise<number> {
    const MIN_XP_LEVEL = 1;
    const MAX_XP_LEVEL = 5;

    return this.normalizeValue(sellerExpLevel, MIN_XP_LEVEL, MAX_XP_LEVEL) * (-1);
  }

  private getDiscountByCustomerSegment(segment: string): number {
    const discountsBySegment = {
      "A": -0.025,
      "B": -0.05,
      "C": 0.025,
      "D": 0.05,
      "E": 0.1
    };

    return discountsBySegment[segment];
  }

  private async getDiscountByCustomerLocalization(currentPos: any, product: Product): Promise<number> {
    let customers = await Customer.all();

    customers = this.getSortedCustomersByDistance(customers, currentPos).slice(0, 10);

    const nearestCustomersId = customers.map(customer => customer.id);

    const negotiations = await Negotiation.query()
      .whereIn('customer_id', nearestCustomersId)
      .andWhere('product_id', product.id)
      .andWhere('is_closed', true);

    const negotiatedPrices = negotiations.map(negotiation => negotiation.negotiatedPrice);
    const averagePrice = negotiatedPrices.reduce((a, b) => a + b) / negotiations.length;
    const averageDiscount = (averagePrice / product.baseMinPrice) - 1;

    return averageDiscount;
  }

  private normalizeValue(value: number, minValue: number, maxValue: number): number {
    const RANGE_MIN = -0.1;
    const RANGE_MAX = 0.1;

    // normalize number in range [-0.1, 0.1] => [a, b]
    // x" = (b - a) * ((x - min_x) / (max_x - min_x)) + a
    return ((RANGE_MAX - RANGE_MIN) * ((value - minValue) / (maxValue - minValue)) + RANGE_MIN);
  }

  private getSortedCustomersByDistance(customers: Customer[], currentPos: any): Customer[] {
    return this.updateCustomersWithDistance(customers, currentPos)
      .sort((cust1, cust2) => this.sortCustomersByDistance(cust1, cust2));
  }

  private updateCustomersWithDistance(customers: Customer[], currentPos: any): Customer[] {
    return customers.map(customer => {
      const { latitude, longitude } = customer;

      customer.distance = getDistance(currentPos, { latitude, longitude });

      return customer;
    });
  }

  private sortCustomersByDistance(cust1: Customer, cust2: Customer): number {
    return cust1.distance < cust2.distance ? -1 : cust1.distance > cust2.distance ? 1 : 0;
  }
}

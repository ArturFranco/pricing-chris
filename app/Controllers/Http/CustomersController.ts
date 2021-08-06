import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Customer from '../../Models/Customer';

export default class CustomersController {

  public async index({}: HttpContextContract) {
    return await Customer.all();
  }

  public async store({ request }: HttpContextContract): Promise<Customer> {
    const data = request.body();

    return await Customer.create(data);
  }

  public async show({ params }: HttpContextContract): Promise<Customer> {
    return await Customer.findOrFail(params.id);
  }

  public async update({ request, params }: HttpContextContract): Promise<Customer> {
    const customer = await Customer.findOrFail(params.id);
    const data = request.body();

    customer.merge(data);
    await customer.save();

    return customer;
  }

  public async destroy({ params }: HttpContextContract): Promise<void> {
    const customer = await Customer.findOrFail(params.id);

    await customer.delete();
  }
}

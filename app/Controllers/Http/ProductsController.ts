import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Product from '../../Models/Product';

export default class CustomersController {

  public async index ({}: HttpContextContract) {
    return await Product.all();
  }

  public async store({ request }: HttpContextContract): Promise<Product> {
    const data = request.body();

    return await Product.create(data);
  }

  public async show({ params }: HttpContextContract): Promise<Product> {
    return await Product.findOrFail(params.id);
  }

  public async update({ request, params }: HttpContextContract): Promise<Product> {
    const product = await Product.findOrFail(params.id);
    const data = request.body();

    product.merge(data);
    await product.save();

    return product;
  }

  public async destroy({ params }: HttpContextContract): Promise<void> {
    const product = await Product.findOrFail(params.id);

    await product.delete();
  }
}

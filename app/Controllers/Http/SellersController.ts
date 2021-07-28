import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Seller from '../../Models/Seller';

export default class SellersController {

  public async index ({}: HttpContextContract) {
    return await Seller.all();
  }

  public async store({ request }: HttpContextContract): Promise<Seller> {
    const data = request.body();

    return await Seller.create(data);
  }

  public async show({ params }: HttpContextContract): Promise<Seller> {
    return await Seller.findOrFail(params.id);
  }

  public async update({ request, params }: HttpContextContract): Promise<Seller> {
    const seller = await Seller.findOrFail(params.id);
    const data = request.body();

    seller.merge(data);
    await seller.save();

    return seller;
  }

  public async destroy({ params }: HttpContextContract): Promise<void> {
    const seller = await Seller.findOrFail(params.id);

    await seller.delete();
  }
}

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import Product from '../../Models/Product';
import Negotiation from '../../Models/Negotiation';

export default class PnlsController {

  private static readonly OPERATING_EXPENSES = 150.00;
  private static readonly INTEREST_EXPENSE = 15.00;
  private static readonly DEPREC_AND_AMORT = 5.00;

  private static readonly GENERAL_EXPENSES =
    PnlsController.OPERATING_EXPENSES +
    PnlsController.INTEREST_EXPENSE +
    PnlsController.DEPREC_AND_AMORT;

  private static readonly TAX = 0.1125;

  private static readonly PERCENT = 100;
  
  public async show({ request, params, response }: HttpContextContract): Promise<void> {
    const { negotiatedPrice, product } = await Negotiation.query()
      .where('id', params.id)
      .preload('product')
      .firstOrFail();

    // Receita total (preço negociado)
    const price = negotiatedPrice ? negotiatedPrice : parseFloat(request.input('price'));

    if (!price) {
      return response.badRequest({ error: "You must provide a price for this negotiation" });
    }

    // Custos de fabricação/produção/venda
    const { directCosts } = await Product.findOrFail(product.id);

    // Margem bruta
    const grossMargin = price - directCosts;

    // Impostos
    const incomeTaxes = parseFloat((price * PnlsController.TAX).toFixed(2));

    // Despesas totais
    const totalExpenses = parseFloat((directCosts + incomeTaxes + PnlsController.GENERAL_EXPENSES).toFixed(2));

    // Lucro líquido
    const netProfit = parseFloat((price - totalExpenses).toFixed(2));

    response.ok({
      revenue: price,
      direct_costs: directCosts,
      gross_margin: grossMargin,
      gross_margin_percent: parseFloat(((grossMargin / price) * PnlsController.PERCENT).toFixed(2)),
      operating_expenses: PnlsController.OPERATING_EXPENSES,
      operating_income: grossMargin - PnlsController.OPERATING_EXPENSES,
      interest_expense: PnlsController.INTEREST_EXPENSE,
      income_taxes: incomeTaxes,
      depr_and_amort: PnlsController.DEPREC_AND_AMORT,
      total_expenses: totalExpenses,
      net_profit: netProfit,
      net_profit_percent: parseFloat(((netProfit / price) * PnlsController.PERCENT).toFixed(2))
    });
  }
}

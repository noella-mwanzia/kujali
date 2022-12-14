import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';


export class PromoteBudgetHandler extends FunctionHandler<any, any>
{

  public async execute(budget: any, context: FunctionContext, tools: HandlerTools) {

    tools.Logger.log(() => `Starting promote budget`);
  }
}
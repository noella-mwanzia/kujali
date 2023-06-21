import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { HandlerTools } from '@iote/cqrs';

import * as jwt from 'jsonwebtoken';

/** This handler creates a corresponding metabase account for new sign ups */
export class CreateUserMetabaseAccHandler extends FunctionHandler<user:any, string>
{
  public async execute( data: any, context: FunctionContext, tools: HandlerTools)
  {
    
  }
}

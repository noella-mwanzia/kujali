import * as request from 'request-promise';

import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { HandlerTools } from '@iote/cqrs';

import { User } from '@iote/bricks';

/* This handler creates a corresponding metabase account for new sign ups */
export class CreateUserMetabaseAccHandler extends FunctionHandler<User, any>
{
  public async execute( user: User, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `Creating metabase acc for User: ${user.uid}`);

    await request.post(this.createRequestConfig(user));

    //TODO: implement proper error handling.

    tools.Logger.log(() => `User account successfully created`);

  }

  /** configure the contents of the api call */
  createRequestConfig(user: User)
  {
    const displayname = user.displayName!.split('');

    //Todo: create a general super admin account to handle creation of user accounts and API calls
    //Todo: Move sensitive variables to secrets

    return {
        url: 'https://elewa-group.metabaseapp.com/api/user',
        headers: {
          'Content-Type' : 'application/json',
          'Accept': 'application/json',
          'auth': {
            'username': 'noella@elewa.ke',
            'password': 'liMQAQAKa%2BZFkULYp',
          }
        },
        body: {
            'first_name': displayname[0],
            'last_name': displayname[1],
            'email': user.email
        },
        json: true
      }
}
}

import * as jwt from 'jsonwebtoken';

import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { HandlerTools } from '@iote/cqrs';

import { User } from '@angular/fire/auth';


export class GetMetabaseUrlHandler extends FunctionHandler<User, string>
{
  public async execute(user: User, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `Setting up metabase url for User: ${JSON.stringify(user.uid)}`);

    const METABASE_SITE_URL = "https://elewa-group.metabaseapp.com";
    const METABASE_SECRET_KEY = "b9fa257a1f5c32edd31fe24b45cfdfe1e38b7b4e85c3cf716a277e3eaf42fec5";

    const displayname = user.displayName!.split('');

    const payload = {
      resource: { dashboard: 3 },
      params: {},
      email: user.email,
      first_name: displayname[0],
      last_name: displayname[1],
      groups: ["Engineer", "People"]
    }

    const token = jwt.sign(payload, METABASE_SECRET_KEY);

    const iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

    return iframeUrl;
  }
}

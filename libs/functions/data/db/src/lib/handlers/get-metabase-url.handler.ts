import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { HandlerTools } from '@iote/cqrs';

import * as jwt from 'jsonwebtoken';

export class GetMetabaseUrlHandler extends FunctionHandler<{}, string>
{
  public async execute({}, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `Setting up metabase url`);

    const METABASE_SITE_URL = "https://elewa-group.metabaseapp.com";
    const METABASE_SECRET_KEY = "b9fa257a1f5c32edd31fe24b45cfdfe1e38b7b4e85c3cf716a277e3eaf42fec5";

    // const payload = {
    // resource: { dashboard: 3 },
    // params: {},
    // exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
    // };

    const payload = {
      resource: { dashboard: 3 },
      params: {},
      email: 'test@gmail.com',
      first_name: 'John',
      last_name: 'Doe',
      exp: Math.round(Date.now() / 1000) + (10 * 60), // 10 minute expiration
      groups: ["Engineer", "People"]
    }

    const token = jwt.sign(payload, METABASE_SECRET_KEY);

    const iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=true&titled=true";

    return iframeUrl;
  }
}

//Hook into firebase auth system
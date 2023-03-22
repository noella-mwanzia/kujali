import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { HandlerTools } from '@iote/cqrs';

import * as request from 'request-promise';
import axios from 'axios';

const BANK_PAYMENTS_REPO = `http://34.89.234.25:8000/sql`;

export class CreatePaymentsHandler extends FunctionHandler<any, any>
{
  public async execute(data: any, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[Writing payments to SurrealDB].execute: payments are ${data.length}`);
    

    await this.axiosTest(tools).then((res) => {
      tools.Logger.log(() => `Axios was succesful: ${JSON.stringify(res)}`);
    });
  }

  async axiosTest (tools: HandlerTools) {

    tools.Logger.log(() => `Executing axiosTest`);

    const auth = {
      username: 'root',
      password: 'root'
    }

    const config = {
      url: 'http://34.89.234.25:8000/sql',
      headers: {
        'Content-Type' : 'application/json',
        'Accept': 'application/json',
        'auth': {
          'username': 'root',
          'password': 'root',
        },
      },
      body: `SELECT * FROM company`,
      json: true,
    };

    const url = BANK_PAYMENTS_REPO;
  
    return request.post(config).then((res) => {
      tools.Logger.log(() => `Executing axiosTest ${JSON.stringify(res)}`);
    })
  }
}
import { RestRegistrar } from '@ngfi/functions';

import { ReauthorizePontoAccountHandler } from '@app/functions/api/finance/banking/ponto-connect';

import { KujaliFunction } from 'apps/kujali-functions/src/environments/kujali-func.class';

const handler = new ReauthorizePontoAccountHandler();

export const requestPontoReauthorization = new KujaliFunction("requestPontoReauthorization",
                                                  new RestRegistrar(),
                                                  [],
                                                  handler)
                                                  .build();

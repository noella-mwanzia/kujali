import { RestRegistrar } from '@ngfi/functions';

import { UpdatePontoConnectionHandler } from '@app/functions/api/finance/banking/ponto-connect';

import { KujaliFunction } from 'apps/kujali-functions/src/environments/kujali-func.class';

const handler = new UpdatePontoConnectionHandler();

export const updatePontoConnection = new KujaliFunction("updatePontoConnection",
                                                  new RestRegistrar(),
                                                  [],
                                                  handler)
                                                  .build();

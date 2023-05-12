import { RestRegistrar } from '@ngfi/functions';

import { GetPontoOrgDetailsHandler } from '@app/functions/api/finance/banking/ponto-connect';

import { KujaliFunction } from 'apps/kujali-functions/src/environments/kujali-func.class';

const handler = new GetPontoOrgDetailsHandler();

export const getOrgDetails = new KujaliFunction("getOrgDetails",
                                                  new RestRegistrar(),
                                                  [],
                                                  handler)
                                                  .build();

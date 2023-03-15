import { RestRegistrar } from '@ngfi/functions';

import { CreatePontoOnboardingDetailsHandler } from '@app/functions/api/finance/banking/ponto-connect';

import { KujaliFunction } from 'apps/kujali-functions/src/environments/kujali-func.class';

const handler = new CreatePontoOnboardingDetailsHandler();

export const createPontoOnboardingDetails = new KujaliFunction("createPontoOnboardingDetails",
                                                  new RestRegistrar(),
                                                  [],
                                                  handler)
                                                  .build();

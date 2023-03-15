import { RestRegistrar } from '@ngfi/functions';

import { SetSelectedBankAccountHandler } from '@app/functions/api/finance/banking/ponto-connect';

import { KujaliFunction } from 'apps/kujali-functions/src/environments/kujali-func.class';

const handler = new SetSelectedBankAccountHandler();

export const setSelectedBankAccount = new KujaliFunction("setSelectedBankAccount",
                                                  new RestRegistrar(),
                                                  [],
                                                  handler)
                                                  .build();

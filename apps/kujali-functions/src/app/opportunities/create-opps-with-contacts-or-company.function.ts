import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from '../../environments/kujali-func.class';

import { CreateOppsWithContactOrCompanyHandler } from '@app/functions/finance/business/opportunities'; 

const createOppsWithContactOrCompanyHandler = new CreateOppsWithContactOrCompanyHandler();

export const createOppsWithContactOrCompany = new KujaliFunction('createOppsWithContactOrCompany',
                                                  new RestRegistrar(),
                                                  [],
                                                  createOppsWithContactOrCompanyHandler)
                                                  .build()

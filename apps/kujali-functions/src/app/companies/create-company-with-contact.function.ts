import { RestRegistrar } from '@ngfi/functions';

import { CreateCompanyWithContactHandler } from '@app/functions/finance/business/companies'; 

import { KujaliFunction } from '../../environments/kujali-func.class';

const createCompanyWithContactHandler = new CreateCompanyWithContactHandler();

export const createCompanyWithContact = new KujaliFunction('createCompanyWithContact',
                                                  new RestRegistrar(),
                                                  [],
                                                  createCompanyWithContactHandler)
                                                  .build()

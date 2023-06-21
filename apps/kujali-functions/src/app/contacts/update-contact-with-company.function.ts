import { RestRegistrar } from '@ngfi/functions';

import { UpdateContactWithCompanyHandler } from '@app/functions/finance/business/contacts'; 

import { KujaliFunction } from '../../environments/kujali-func.class';

const updateContactWithCompanyHandler = new UpdateContactWithCompanyHandler();

export const updateContactWithCompany = new KujaliFunction('updateContactWithCompany',
                                                  new RestRegistrar(),
                                                  [],
                                                  updateContactWithCompanyHandler)
                                                  .build()

import { RestRegistrar } from '@ngfi/functions';

import { sendQuoteEmailHandler } from '@app/functions/api/email-service';

import { KujaliFunction } from '../../../environments/kujali-func.class';

const quoteEmailHandler = new sendQuoteEmailHandler();


export const sendQuoteEmail = new KujaliFunction('sendQuoteEmail',
                                          new RestRegistrar(),
                                          [],
                                          quoteEmailHandler)
                                          .build()


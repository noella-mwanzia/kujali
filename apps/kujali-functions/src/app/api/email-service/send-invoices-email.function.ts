import { RestRegistrar } from '@ngfi/functions';

import { sendInvoiceEmailHandler } from '@app/functions/api/email-service';

import { KujaliFunction } from '../../../environments/kujali-func.class';

const invoiceEmailHandler = new sendInvoiceEmailHandler();

export const sendInvoiceEmail = new KujaliFunction('sendInvoiceEmail',
                                          new RestRegistrar(),
                                          [],
                                          invoiceEmailHandler)
                                          .build()


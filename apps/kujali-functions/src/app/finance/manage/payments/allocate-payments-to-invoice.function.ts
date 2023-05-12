import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from '../../../../environments/kujali-func.class';

import { AllocatePaymentsToInvoiceHandler } from '@app/functions/finance/manage/payments';

const allocatePaymentsToInvoiceHandler = new AllocatePaymentsToInvoiceHandler();

export const allocatePaymentsToInvoice = new KujaliFunction('allocatePaymentsToInvoice',
                                    new RestRegistrar(), 
                                    [], 
                                    allocatePaymentsToInvoiceHandler)
                                    .build()

import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from '../../../../environments/kujali-func.class';

import { AllocateInvoicesToPaymentHandler } from '@app/functions/finance/manage/payments';

const allocateInvoicesToPaymentHandler = new AllocateInvoicesToPaymentHandler();

export const allocateInvoicesToPayment = new KujaliFunction('allocateInvoicesToPayment',
                                    new RestRegistrar(), 
                                    [], 
                                    allocateInvoicesToPaymentHandler)
                                    .build()

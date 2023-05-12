import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from '../../../../environments/kujali-func.class';

import { AllocateExpensesHandler } from '@app/functions/finance/manage/expenses';

const allocateExpensesHandler = new AllocateExpensesHandler();

export const allocateExpenses = new KujaliFunction('allocateExpenses',
                                    new RestRegistrar(), 
                                    [], 
                                    allocateExpensesHandler)
                                    .build()

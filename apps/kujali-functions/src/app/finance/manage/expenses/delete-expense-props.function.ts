import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from '../../../../environments/kujali-func.class';

import { DeleteExpenseProps } from '@app/functions/finance/manage/expenses';

const deleteExpensePropsHandler = new DeleteExpenseProps();

export const deleteExpenseProps = new KujaliFunction('deleteExpenseProps',
                                    new RestRegistrar(), 
                                    [], 
                                    deleteExpensePropsHandler)
                                    .build()

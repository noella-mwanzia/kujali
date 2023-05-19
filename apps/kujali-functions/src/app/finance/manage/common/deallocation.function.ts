import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from '../../../../environments/kujali-func.class';

import { DeAllocateHandler } from '@app/functions/finance/manage/common';

const deAllocationHandler = new DeAllocateHandler();

export const deAllocate = new KujaliFunction('deAllocate',
                                    new RestRegistrar(), 
                                    [], 
                                    deAllocationHandler)
                                    .build()

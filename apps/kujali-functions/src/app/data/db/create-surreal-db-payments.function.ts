import { RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from '../../../environments/kujali-func.class';

import { CreatePaymentsHandler } from '@app/functions/data/db';

const handler = new CreatePaymentsHandler();

export const createSurrealDbPayments = new KujaliFunction(
                                        'createSurrealDbPayments',
                                        new RestRegistrar(),
                                        [],
                                        handler)
                                        .build()

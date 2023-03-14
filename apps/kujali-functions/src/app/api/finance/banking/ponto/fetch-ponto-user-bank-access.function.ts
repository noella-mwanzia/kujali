import { EndpointRegistrar } from '@ngfi/functions';

import { FetchPontoUserBankAccessHandler } from '@app/functions/api/finance/banking/shared';

import { KujaliFunction } from '../../../../../environments/kujali-func.class';


const handler = new FetchPontoUserBankAccessHandler();

export const fetchPontoUserBankAccess
    = new KujaliFunction("fetchPontoUserBankAccess",
             new EndpointRegistrar('europe-west1'),
             [],
             handler)
    .build();

import { PubSubRegistrar, RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from '../../../environments/kujali-func.class';

import { BdgtCalculateHeaderOnSaveBudget } from '@app/functions/finance/budgeting';

const CALCULATE_BUDGET_HEADER_TOPIC = '';

const bdgtCalculateHeaderOnSaveBudgetHandler = new BdgtCalculateHeaderOnSaveBudget();

export const bdgtCalculateHeaderOnSaveBudget = new KujaliFunction(
                'bdgtCalculateHeaderOnSaveBudget',
                new RestRegistrar(),
                [],
                bdgtCalculateHeaderOnSaveBudgetHandler)
              .build()


export const bdgtCalculateHeaderPubSub = new KujaliFunction(
                'bdgtCalculateHeaderPubSub',
                new PubSubRegistrar(CALCULATE_BUDGET_HEADER_TOPIC),
                [],
                bdgtCalculateHeaderOnSaveBudgetHandler as any)
              .build()
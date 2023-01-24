import { PubSubRegistrar, RestRegistrar } from '@ngfi/functions';

import { KujaliFunction } from '../../../environments/kujali-func.class';

import { BdgtCalculateHeaderOnSaveBudget } from '@app/functions/finance/budgeting';

import { BdgtCalculateHeaderPubSub } from '@app/functions/finance/budgeting';

const CALCULATE_BUDGET_HEADER_TOPIC = 'bdgtCalculateHeaderPubSub';

const bdgtCalculateHeaderOnSaveBudgetHandler = new BdgtCalculateHeaderOnSaveBudget();

const bdgtCalculateHeaderPubSubHandler = new BdgtCalculateHeaderPubSub();

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
                bdgtCalculateHeaderPubSubHandler as any)
              .build()
import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { HandlerTools } from '@iote/cqrs';

import { Organisation } from '@app/model/organisation';

import { KuUser } from '@app/model/common/user';

import { OnboardingDetailsObj } from '@app/model/finance/banking/ponto';

import { PontoConnectOnboardingService } from '../services/ponto-connect-onboarding.service';

/**
   * @class CreatePontoOnboardingDetailsHandler
   *
   * Step 1. Initialize Onboarding Service
   *
   * Step 2. Create onboarding session
   *
   * Step 3. Return OnboardingId
   *
   * @returns onboardingObject id or errors object
   */
export class CreatePontoOnboardingDetailsHandler extends FunctionHandler<{ user: KuUser, org?: Organisation}, any>
{
  public async execute(data: { user: KuUser, org?: Organisation}, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[CreatePontoOnboardingDetailsHandler].execute: processing request for onboarding link for: ${ data.org!.id }.`);

    // Step 1. Initialize Onboarding Service

    const onboardingService = new PontoConnectOnboardingService(
                                    tools.Logger);

    // Step 2. Create onboarding session
    const result = await onboardingService.getOnboardingId(data.org!, data.user);
    tools.Logger.log(() => JSON.stringify(result));

    if(result.errors)
    {
      tools.Logger.error(() => "An error has occured.");
      return result;
    }

    tools.Logger.log(() => "SUCCESS!! 🙌🙌🎉🎉🎉🎉🎉");

    // Step 3. Return OnboardingId
    return (result.data as OnboardingDetailsObj).id;
  }

}
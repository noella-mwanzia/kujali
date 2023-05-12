import { BankConnection } from "@app/model/finance/banking";
import { OnboardingDetailsObj } from "./onboarding-details.interface";

/**
 * @interface PontoConnection
 *
 * @extends BankConnection
 *
 * @description Stores information related to a Ponto AccountHolder
 *
*/

export interface PontoConnection extends BankConnection
{
	/**
   * @description The authorization code we use to get a Bearer token in order to perform
	 * actions on behalf of the account holder.(provided by Ponto Connect after onboarding)
	*/
  userAccess?:  { refresh_token : string;
                  access_token: string;
                  expires_in: number;
                  scope: string;
                  token_type: string;
                  authCode?: string;
                };
  /** @description The onboarding details specific to this account */
  // onboardingDetails:  OnboardingDetailsObj
  paymentsActivated: boolean;

  /** Url used to activate payments */
  paymentActivationUrl: string;

  /**
   * Id of the organization associated with the Ponto account
   * @see https://documentation.ibanity.com/ponto-connect/1/api/curl#get-user-info
   */
  organizationId: string;
}

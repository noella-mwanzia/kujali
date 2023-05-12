import { Logger } from '@iote/cqrs';

import { KuUser } from '@app/model/common/user';
import { Organisation } from '@app/model/organisation';
import { AccessToken } from '@app/model/finance/banking';
import { OnboardingDetailsObj } from '@app/model/finance/banking/ponto';

import { PontoConnectUtilityService } from "../../base/ponto-util.service";

const PONTO_IBANITY_API_ENDPOINT = process.env['PONTO_IBANITY_API_ENDPOINT'];
const PONTO_IBANITY_ONBOARDING_ENDPOINT = process.env['PONTO_IBANITY_ONBOARDING_ENDPOINT'];
const PONTO_IBANITY_REAUTHORIZE_ENDPOINT = process.env['PONTO_IBANITY_REAUTHORIZE_ENDPOINT'];

export class PontoConnectOnboardingService
{
  private _utilityService: PontoConnectUtilityService;

  constructor(private _logger: Logger)
  {
    this._utilityService = new PontoConnectUtilityService(_logger);
  }

  getOnboardingId(org: Organisation, user: KuUser)
  {
    const data = this._createOnboardingDetails(org, user);
    return this._utilityService.makePontoPostRequest(data, PONTO_IBANITY_ONBOARDING_ENDPOINT!);
  }

  private _createOnboardingDetails(org: Organisation, user: KuUser): OnboardingDetailsObj
  {
    const names = user.displayName!.split(' ');
    const kboNumberCleaned = org.kboNumber?.split('.').join('');

    return {  type: "onboardingDetails",
              attributes: {
                email: user.email,
                firstName: names[0],
                lastName: names.length > 1 ? names[names.length - 1] : '',
                phoneNumber: user.profile.phone ?? '',
                organizationName: org.name,
                enterpriseNumber: (kboNumberCleaned ?? 0).toString(),
                addressStreetAddress: org.address!.streetName ?? '',
                addressPostalCode: org.address!.postalCode ?? '',
                addressCity: org.address!.city ?? '',
                addressCountry: "BE"
              }
            }
  }

  async getPontoFAccounts(token: string)
  {
    const endpoint = PONTO_IBANITY_API_ENDPOINT + 'accounts';
    const res = await this._utilityService.performGetRequest(token, endpoint);
    const accounts = res.data;

    return accounts;
  }

  /**
   * @function getUserInfo
   * @param {string} token
   * @return {*}  {Promise<{sub: string, paymentsActivated: boolean, onboardingComplete: boolean, name: string}>}
   *
   * Returns the org/org details associated with the provided access token
   */
  async getUserInfo(token:string): Promise<{sub: string, paymentsActivated: boolean, onboardingComplete: boolean, name: string}>
  {
    const endpoint = PONTO_IBANITY_API_ENDPOINT + `userinfo`;
    return this._utilityService.performGetRequest(token, endpoint, {});
  }

  /**
   * @function revokeIntegration
   * @param {string} token
   * @see https://documentation.ibanity.com/ponto-connect/api/curl#delete-organization-integration
   *
   * Revoke user authorization meaning user will have to be onboarded again.
   * Works even if the access token provided is already expired.
   *
   */
  async revokeIntegration(token:string)
  {
    const organizationId = (await this.getUserInfo(token)).sub;

    const endpoint = PONTO_IBANITY_API_ENDPOINT + `organizations/${organizationId}/integration`;

    try{
      await this._utilityService.performDeleteRequest(token, endpoint, {});
    }
    catch(err){
      this._logger.log(() => `Error deleting the integration ${err}`);
    }
    return
  }

  requestReauthorization(bankAccId: string, redirectUrl: string, accessToken: AccessToken)
  {
    const data = {
      type: "reauthorizationRequest",
      attributes: {
        redirectUri: redirectUrl
      }
    }

    const endpoint = PONTO_IBANITY_REAUTHORIZE_ENDPOINT!.replace('accountId', bankAccId);
    return this._utilityService.makePontoPostRequest(data, endpoint, accessToken);
  }
}

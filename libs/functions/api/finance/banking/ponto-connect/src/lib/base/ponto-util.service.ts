import { Logger } from "@iote/bricks-angular";

import axios from 'axios';

import * as request from 'request-promise';

import * as fs from 'fs';

import * as path from 'path';

import { PontoSignatureService } from '../services/ponto-signature.provider';

import { AccessToken, BankConnectionAccountType, FetchAccessTokenCmd } from "@app/model/finance/banking";

export class PontoConnectUtilityService
{
  constructor(private _logger: Logger)
  {  }

  async doCall(data: any, endpoint: string, accessToken?: AccessToken, useSignature = false)
  {
    const conn = accessToken ? accessToken : await this.establishConnection();

    this._logger.log(() => `Ponto Connect Access token: ${ conn.access_token }`);
    this._logger.log(() => `Ponto Connect Request body: ${ JSON.stringify(data) }`);

    // Files for auth purposes
    const certFile = fs.readFileSync(path.resolve(__dirname, ['assets', 'security', 'certificates', 'ponto', 'certificate', 'certificate.pem'].join('/')));
    const keyFile = fs.readFileSync(path.resolve(__dirname, ['assets', 'security', 'certificates', 'ponto', 'certificate', 'private_key.pem'].join('/')));

    const vals = useSignature ? this.getSignature(data, endpoint, accessToken) : null;
    const signature = vals?.signature ?? null;
    const digest = vals?.digest ?? null;

    try{
      const options = {
        url: endpoint,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${ conn.access_token }`,
          'Signature' : signature,
          'Digest': digest
        },
        body: { "data": data },
        json: true,
        agentOptions: {
          cert: certFile,
          key: keyFile,
          passphrase: '12Valene',
          securityOptions: 'SSL_OP_NO_SSLv3',
        }
      };

      return request.post(options);
    } catch (err){
      this._logger.log(() => `[PontoConnectUtilityService].doCall : ❌❌❌❌ Error executing Ponto Call: ${JSON.stringify(err)}`);
      throw(err);
    }
  }

  getSignature(data: any, endpoint: string, accessToken?: AccessToken){
    const signatureService = new PontoSignatureService(this._logger);
    return signatureService.getSignatureHeader(data, endpoint, accessToken);
  }

  getRequestOptions(authorization: string, url: string, data?: any)
  {
    this._logger.log(() => `Data: ${JSON.stringify(data)}`);
    this._logger.log(() => `Endpoint: ${url}`);

    // Files for auth purposes
    const certFile = fs.readFileSync(path.resolve(__dirname, ['assets', 'security', 'certificates', 'ponto', 'certificate', 'certificate.pem'].join('/')));
    const keyFile = fs.readFileSync(path.resolve(__dirname, ['assets', 'security', 'certificates', 'ponto', 'certificate', 'private_key.pem'].join('/')));

    return {
      url: url,
      headers: {  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/vnd.api+json',
                  'Authorization': authorization
                },
      formData: data,
      json: true,
      agentOptions: {
        cert: certFile,
        key: keyFile,
        passphrase: '12Valene',
        securityOptions: 'SSL_OP_NO_SSLv3',
      }
    };
  }

  /**
   * @function getInitialAccessToken
   * @description Fetches an access token for the project.
   *
   * @see https://documentation.ibanity.com/ponto-connect/api/curl#request-client-access-token
   *
   * @returns Promise<{ "access_token": string,
   *            "expires_in": number,
   *            "token_type": string,
   *            "scope": string }>
   */
  async establishConnection(): Promise<{ "access_token": string, "token_type": string, "expires_in": number, "scope": string }>
  {
    const body = {
      grant_type: 'client_credentials'
    };

    return this._makeTokenRequest(body);
  }

  /** Get Relevant access token (initial/refresh token) */
  async getAccessToken(refreshToken: string, authCode: string, redirectUrl?: string)
  {
    if(refreshToken)
    {
      // Refresh auth token
      return this.refreshUserAccessToken(refreshToken);
    }

    // Set initial refresh token before auth code expires
    return this.getInitialUserAccessToken(authCode, redirectUrl ?? "");
  }

  /**
   * @function getInitialUserAccessToken
   * @description Fetches the initial user access token when user first links to ponto account.
   *
   * @see https://documentation.ibanity.com/ponto-connect/api/curl#request-initial-tokens
   *
   * @see https://github.com/request/request-promise/issues/251 - adding certificate, key, etc
   *
   * @param authCode -The OAuth code sent back when linking user accounts between kujali and Ponto
   *
   * @param redirectUrl -The url to send the user back to
   *
   * @returns Promise<{ "access_token": string,
   *            "expires_in": number,
   *            "refresh_token": string,
   *            "token_type": string,
   *            "scope": string }>
   */
  async getInitialUserAccessToken(authCode: string, redirectUrl: string): Promise<AccessToken>
  {
    const randomString = '';

    const body = {
      'code': authCode,
      'client_id': '4c2790ba-5c8f-44e8-aa0f-d7409cc11b1c',
      'redirect_uri': redirectUrl,
      'grant_type': 'authorization_code',
      'code_verifier': randomString
    };

    return this._makeTokenRequest(body);
  }


  /**
   * @function refreshUserAccessToken
   * @description Fetches a new access token.
   *
   * @see https://documentation.ibanity.com/ponto-connect/api/curl#request-access-token
   *
   * @param refreshToken : Refresh token from the last auth request
   *
   * @returns Promise<{ "access_token": string,
   *            "expires_in": number,
   *            "refresh_token": string,
   *            "token_type": string,
   *            "scope": string }>
   */
  async refreshUserAccessToken(refreshToken: string): Promise<{ "access_token": string, "expires_in": number, "refresh_token": string, "token_type": string, "scope": string }>
  {
    const randomString = '';

    const body = {
      'refresh_token': refreshToken,
      'client_id': '4c2790ba-5c8f-44e8-aa0f-d7409cc11b1c',
      'code_verifier': randomString,
      'grant_type': 'refresh_token'
    };

    return this._makeTokenRequest(body);
  }

  private _makeTokenRequest(data: any, apiEndpoint?: string)
  {
    // Authorization string as specified
    const authEncoded = Buffer.from('4c2790ba-5c8f-44e8-aa0f-d7409cc11b1c' + ':' + 'be5a95c6-6416-4d41-b52e-7fde64050e8e').toString('base64');

    const url = apiEndpoint ?? `https://api.ibanity.com/ponto-connect/oauth2/token`;
    const auth = `Basic ${authEncoded}`;

    const options = this.getRequestOptions(auth, url, data);

    try{
      return request.post(options);
    } catch (err){
      this._logger.log(() => `[PontoConnectUtilityService].getPontoUserAccess : ❌❌❌❌ Error executing Ponto Call: ${JSON.stringify(err)}`);
      throw(err);
    }
  }

  performGetRequest(token: string, endpoint:string, data?: any)
  {
    const auth = `Bearer ${token}`;

    const options = this.getRequestOptions(auth, endpoint, data);

    try{
      return request.get(options);
    } catch (err){
      this._logger.log(() => `[PontoConnectUtilityService].performGetRequest : ❌❌❌❌ Error executing Ponto Call: ${JSON.stringify(err)}`);
      throw(err);
    }
  }

  performDeleteRequest(token: string, endpoint:string, data?: any)
  {
    const auth = `Bearer ${token}`;

    const options = this.getRequestOptions(auth, endpoint, data);

    try{
      return request.delete(options);
    } catch (err){
      this._logger.log(() => `[PontoConnectUtilityService].performDeleteRequest : ❌❌❌❌ Error executing Ponto Call: ${JSON.stringify(err)}`);
      throw(err);
    }
  }


  async getPontoUserAccess(orgId: string, orgAccId: string, authCode?: string, redirectUrl?: string){
    const body: FetchAccessTokenCmd = {
      orgId,
      orgAccId,
      connectionType: BankConnectionAccountType.Ponto,
      authCode,
      redirectUrl
    };

    const endpoint = 'https://europe-west1-kujali-1be70.cloudfunctions.net/fetchPontoUserBankAccess';

    try{
      return request.post(endpoint,
                          {
                            headers: {'Content-Type': 'application/json' },
                            json: true,
                            body
                          });
    } catch (err){
      this._logger.log(() => `[PontoConnectUtilityService].getPontoUserAccess : ❌❌❌❌ Error executing Ponto Call: ${JSON.stringify(err)}`);
      this._logger.log(() => `[PontoConnectUtilityService].getPontoUserAccess : ❌❌❌❌ Cannot proceed with Ponto execution!`);
    }
  }
}

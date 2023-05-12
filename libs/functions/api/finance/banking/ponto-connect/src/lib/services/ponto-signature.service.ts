import * as crypto from 'crypto-js';
import * as moment from 'moment';

import * as fs from 'fs';

import { Logger } from "@iote/bricks-angular";

import { AccessToken } from "@app/model/finance/banking";

/**
 * Generates signature based on Ponto specifications
 * @see https://documentation.ibanity.com/security#http-signature
 */
export class PontoSignatureService
{
  constructor(private _logger: Logger)
  {}

  /**
   * @see https://documentation.ibanity.com/security#http-signature
   * @param data payload
   * @param endpoint
   * @param accessToken
   */
   getSignatureHeader(data: any, endpoint: string, accessToken?: AccessToken){
    // Step 1. Construct created
    const created = moment().unix();
    this._logger.log(() => `Created : ${ created }`);

    // Step 2. Construct digest
    const digest = this.constructDigest(data);
    const digestPlusTitle = 'digest: ' + digest;
    this._logger.log(() => `Digest: ${ digest }`);

    // Step 3. Construct signing string
    const signingString = this.getSigningString(endpoint, accessToken!, digestPlusTitle, created);
    this._logger.log(() => `Signing string: ${ signingString }`);

    // Step 4. To allow Ibanity to check the signed headers, you must provide a list of the header names
    const headers = '(request-target) ' + 'host ' + 'digest ' + '(created) ' + 'authorization';
    this._logger.log(() => `Signature headers: ${ headers }`);

    // Step 5. Construct signature
    const signature = this.signData(signingString);
    this._logger.log(() => `Signature: ${ signature }`);

    // Step 6. Combine everything in proper format
    const completeSignatureHeader = this.constructFullHeader(created, headers, signature)
    this._logger.log(() => `Signature header: ${completeSignatureHeader}`);

    return {signature: completeSignatureHeader, digest: digest };
  }

  constructDigest(data: any){
    const dataAlgorithm = 'SHA512';
    const hasher = crypto.createHash(dataAlgorithm);
    const hashed = hasher.update(Buffer.from(JSON.stringify(data))).digest('hex');
    return 'SHA-512' + "=" + hashed;
  }

  getSigningString(endpoint: string, accessToken: AccessToken, digest: string, created: number){
    const hostString = 'api.ibanity.com';
    // Construct requestTarget
    const method = 'post';
    const path = endpoint.split(hostString)[1];
    const requestTarget = '(request-target): ' + method + ' ' + path;
    this._logger.log(() => `Request target: ${ requestTarget }`);

    // Host
    const host = `host: ${hostString}`;
    this._logger.log(() => `Host: ${ host }`);

    // Authorization
    const authorization = 'authorization: ' + `Bearer ${ accessToken.access_token }`;
    this._logger.log(() => `Authorization: ${ authorization }`);

    return `${requestTarget}` + '\n' +
            `${host}` + '\n' +
            `${digest}` + '\n' +
            '(created): ' + `${created}` + '\n' +
            `${authorization}`
  }

  signData(signingString: string){
    const privateKeyFile = fs.readFileSync(process.env.PONTO_IBANITY_SIGNATURE_KEY_PATH);
    const buffered = Buffer.from(signingString);
    const key = {
      key: privateKeyFile,
      passphrase: process.env.PONTO_IBANITY_SIGNATURE_PASSPHRASE,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: 32,
    };
    const algorithm = 'SHA256';
    const signed = crypto.sign(algorithm, buffered, key);
    const base64Signed = signed.toString('base64');
    return base64Signed;
  }

  constructFullHeader(created: number, headers: string, signature: string){
    const keySegment = 'keyId=' + '"' + process.env.PONTO_IBANITY_SIGNATURE_KEY_ID + '",';
    const createdSegment = 'created=' + created + ',';
    const algorithmSegment = 'algorithm=' +'"' + this.getAlgorithm() + '",';
    const headerSegment = 'headers="' + headers + '",';
    const signatureSegment = 'signature=' + '"' + signature + '"';

    const complete = keySegment + createdSegment + algorithmSegment + headerSegment + signatureSegment;
    return complete;
  }

  /**
   * @NOTE hs2019 is not exactly a concrete algorithm type for encoding,
   * but a secure way of hiding the actual algorithm used to an external party and concurrently
   * signifying to the server the format of Signature header used
   */
  getAlgorithm(){
    return 'hs2019';
  }
}

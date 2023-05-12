import { IObject } from '@iote/bricks';

import { AccessToken } from './user-access-token.interface';

export interface AccessTokenWrapper extends IObject {
  id: string
  userAccess: AccessToken;
  version: string;
  status: RefreshTokenStatus
}

export enum RefreshTokenStatus {
  VALID = 0,
  USED = 1
}

export interface AccessToken {

  // uniuqe identifier
  access_token: string;

  // time in seconds
  expires_in: number;

  // unique identifier
  refresh_token: string;

  // type of token
  token_type: string;

  // scope of token
  scope: string;
}

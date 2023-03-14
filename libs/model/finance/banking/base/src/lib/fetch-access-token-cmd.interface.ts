import { BankConnectionAccountType } from "./bank-connection-account-type.enum";

export interface FetchAccessTokenCmd {
  propId: string;
  propAccId: string;
  connectionType: BankConnectionAccountType;
  redirectUrl?: string;
  authCode?: string;
}

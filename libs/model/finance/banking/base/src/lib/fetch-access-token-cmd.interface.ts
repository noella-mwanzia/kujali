import { BankConnectionAccountType } from "./bank-connection-account-type.enum";

export interface FetchAccessTokenCmd {
  orgId: string;
  orgAccId: string;
  connectionType: BankConnectionAccountType;
  redirectUrl?: string;
  authCode?: string;
}

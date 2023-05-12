import { IObject } from "@iote/bricks";
import { BankConnectionAccountType } from "./bank-connection-account-type.enum";
import { BankConnectionAccount } from "./bank-connection-account.interface";
import { BankConnectionStatus } from "./bank-connection-status.enum";

/**
 * @interface {BankConnection}
 *
 * The Bankconnection class represents the integration piece between a org and a Third-party banking API provider.
 *
 * The BankConnection is used to store information on provider configuration, which is used by our adapters to convert the
 * provider data to kujali compatible data.
 */
export interface BankConnection extends IObject
{
  name: string;
  /** ID of the Property linked to this integration account */
  orgId: string;
  /** List of accounts integrated via this connection. */
  accounts: BankConnectionAccount[];

  /** Type of integration. Currently we support swan (we are the bank) and ponto (we use a bank) as integrators */
  type: BankConnectionAccountType;
  /** Integration status of the connection. */
  status: BankConnectionStatus;
}

import { IObject } from '@iote/bricks';

import { BankConnectionAccountType } from '@app/model/finance/banking';

export enum AccountType {
  property = 'property',
  owner = 'owner',
  supplier = 'supplier',
  fictive = 'fictive'
}
export type TransactionType = 'cash' | 'bank';

/** Minimal account information for a specific financial account. */
export interface FAccountInfo 
{
  /** Account ID */
  accId:   string; 
  /** Account name */
  accName: string;
}

/**
 * Financial Account.
 *
 * Accounts are considered transactable i.e. can perform and receive transactions.
 */

export interface FAccount extends IObject
{
  name: string;

  type: AccountType;

  trType: TransactionType;
  iban?: string;
  bic?: string;

  /** Child accounts
   *  - Transactions to and from child accounts are calculated in the master account.
   *    Can regress as deep as one wants.
   *    Used by for example owners and suppliers that can transact over multiple accounts.
   */
  accounts?: FAccount[];

  bankConnection?: BankConnectionAccountType;

}

export enum BankAccount {
  savings, currents
}

export interface AccountOptions {
  savings: FAccount;
  currents: FAccount;
}

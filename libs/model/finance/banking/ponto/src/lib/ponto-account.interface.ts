import { Timestamp } from '@firebase/firestore-types';
import {BankConnectionAccount } from '@s4y/model/accounting/banking/base';

/**
 * A type of BankConnectionAccount that stores ponto-specific account information
 */
export interface PontoAccount extends BankConnectionAccount
{
}

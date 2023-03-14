import { Timestamp } from '@firebase/firestore-types';
import {BankConnectionAccount } from '@app/model/finance/banking';

/**
 * A type of BankConnectionAccount that stores ponto-specific account information
 */
export interface PontoAccount extends BankConnectionAccount
{
}

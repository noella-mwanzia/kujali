
import { config } from 'firebase-functions';
import * as admin from 'firebase-admin';


const conf = config()['firebase'];
admin.initializeApp(conf);

export * from './app/finance/budgeting/promote-budget.function';
export * from './app/finance/budgeting/calculate-budget-headers.function';

export * from './app/api/finance/banking/ponto/fetch-ponto-user-bank-access.function';
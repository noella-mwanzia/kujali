import { FTransaction } from "@app/model/finance/payments";

export interface WritePaymentCommand
{
  orgId: string;
  payment: FTransaction;
  method: DbMethods;
}

export enum DbMethods {
  'CREATE',
  'UPDATE',
  'DELETE'
}
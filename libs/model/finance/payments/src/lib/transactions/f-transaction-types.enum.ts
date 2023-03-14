
export enum FTransactionTypes
{
  /** A direct payment from one account to another. */
  PaymentBase = 0,

  /** A bill from a supplier to an account.
   *   @from = Supplier ? -> Credit Note
   *   @to   = Supplier ? -> Bill
   *   @see paymentDate? - The paymentDate field can be different from the bill date! */
  Bill = 1,

  /** A bill booking, meaning a linkage/settlement from a bill towards an owner (Owner towards account). */
  BillBooking = 2,

  /** A provision is a request to a (group) of owners for provisioning the working account. */
  Provision = 3,

  /** Provision bookings are the linkages/settlements of the provision scoped to the level of an owner and/or lot. */
  ProvisionBooking = 4,

  /** A transaction into/out of a capital account. */
  Capital = 5,
  /** Owner Capital Credit. Result of a capital deduction. */
  CapitalCredit = 50,
  /** Owner Capital Debit. Result of a capital increase. Request to owner to pay up his/her capital. */
  CapitalRequest = 500,
  /** Transfer of capital between two owners upon sale. */
  CapitalTransfer = 555,

  /** A handover is a fictive transaction to a certain account to seed the account with historic date from previous accounting systems. */
  Handover = 6,

  /** A handover-payment is a payment due or owed by owners after closing of a previous book year.  */
  HandoverPayment = 7,

  /** Settlement rest amount */
  Rest = 9,
  /** Virtual type generated to capture payment differences. */
  PaymentDifference = 10,

  /** Transaction linked to another after reconciliation */
  LinkedTransaction = 11
}


/** Transaction types obtained as strings to facilitate processes such as obtaining the correct repository */
export enum TransactionTypes {
  Capital = 'capital',
  Payments = 'payments',
  Provisions = 'provisions'
}

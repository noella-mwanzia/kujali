/**
 * @interface PontoTransaction
 *
 * @see https://documentation.ibanity.com/ponto-connect/api#transaction-relationships
 */
export interface PontoTransaction
{
  type: "transaction",
  relationships: {
    /** The subject account */
    account: {
      links: {
        related: string
      },
      data: {
        type: string,
        id: string
      }
    }
  },
  id: string,
  attributes: {
    /** Date representing the moment the transaction is considered effective */
    valueDate: string,
    /** Type of remittance information, can be structured or unstructured */
    remittanceInformationType: string,
    /** Transaction reference information (To facilitate reconciliation) */
    remittanceInformation: string,
    purposeCode: "CASH" | string,
    proprietaryBankTransactionCode: string,
    mandateId: string,
    internalReference: string,
    /** Date representing the moment the transaction has been recorded */
    executionDate: string,
    endToEndId: string,
    digest: string,
    /** Label/ Description of the transaction */
    description: string,
    currency: string,
    creditorId: string,
    /** IBAN of the account transacted with */
    counterpartReference: string,
    /** Name of the account transacted with */
    counterpartName: string,
    bankTransactionCode: string,
    /** Can be negative or positive */
    amount: number,
    additionalInformation: string
  }
}

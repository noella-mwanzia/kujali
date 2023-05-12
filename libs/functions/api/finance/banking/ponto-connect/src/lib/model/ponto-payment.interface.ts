export interface PontoPayment
{
  type: "payment",
  attributes: {
    /** Transaction reference information (To facilitate reconciliation) */
    remittanceInformation?: string,
    /** Type of remittance information, can be structured or unstructured */
    remittanceInformationType?: 'structured' | 'unstructured',
    /** Label/ Description of the transaction */
    description?: string,
    /** A date in the future when the payment is requested to be executed.  */
    requestedExecutionDate?: string,
    /** Currency of the payment, in ISO4217 format */
    currency: "EUR" | string,
    /** Amount of the payment. Can be positive or negative */
    amount: number,
    /** Name of the payee */
    creditorName: string,
    /** Financial institution's internal reference for the payee's account */
    creditorAccountReference: string,
    /** Type of payee's account reference, such as IBAN */
    creditorAccountReferenceType: "IBAN",
    /** Reference to the financial institution */
    creditorAgent?: string,
    /** Type of financial institution reference */
    creditorAgentType?: string,
    /** URI that your user will be redirected to at the end of the authorization flow. */
    redirectUri?: string
  }
}


/**
 * @interface PontoBankAccount
 * @see https://documentation.ibanity.com/ponto-connect/api/curl#account-attributes
 */
export interface PontoBankAccount{
  // Account details
  subtype: "checking" | "savings" | "securities" | "card",
  product: string,
  /** IBAN in our case */
  referenceType: "IBAN" | string,
  /** Iban number */
  reference: string,
  currency: "EUR" | string,
  internalReference: string,
  holderName: string,
  description: string,
  deprecated: boolean,

  // current balance related details
  currentBalanceVariationObservedAt: string,
  currentBalanceReferenceDate: string,
  currentBalanceChangedAt: string
  currentBalance: number,

  // available balance related details
  availableBalanceVariationObservedAt: string,
  availableBalanceReferenceDate: string,
  availableBalanceChangedAt: string,
  availableBalance: number,

  // authorization details
  authorizedAt: string,
  authorizationExpirationExpectedAt: string
}

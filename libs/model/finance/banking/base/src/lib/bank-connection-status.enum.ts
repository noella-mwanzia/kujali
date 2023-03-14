export enum BankConnectionStatus
{
  // Ponto Specific account statuses as per documentation
  /** Access to an account can be any of these values. No link as details on this are scattered on their documentation page */
	ENABLED   = "Enabled",
	CANCELLED = "Cancelled",
	SUSPENDED = "Suspended",
  EXPIRED   = "Expired",

  // Error cases
  REVOKED   = "Revoked",

  // Swan Specific (account verificationStatuses) As per documentation
  /** @see https://docs.swan.io/concept/account-holder#verification-process */
  NOT_STARTED       = "NotStarted",
  WAITING_FOR_INFO  = "WaitingForInformation",
  PENDING           = "Pending",
  VERIFIED          = "Verified"
}

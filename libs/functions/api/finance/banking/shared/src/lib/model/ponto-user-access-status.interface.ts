
export interface AccessStatus{
  createdOn: Date,
  status: AccessStatusOption,
  orgId: string,
  connectionId: string,
  accountId: string,
  error: {
    name: string,
    statusCode: number,
    description: string,
  }
}

export enum AccessStatusOption{
  ERROR,
  RESOLVED
}

export interface PontoUserAccessError {
  name: string,
  statusCode: number,
  message: string,
  error: {
    error: string,
    error_description: string
  }
}
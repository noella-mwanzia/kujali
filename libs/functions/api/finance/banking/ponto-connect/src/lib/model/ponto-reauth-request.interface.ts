export interface PontoReauthRequest{
  type: "reauthorizationRequest",
  links: {
    redirect: string
  },
  id: string,
  attributes: {}
}

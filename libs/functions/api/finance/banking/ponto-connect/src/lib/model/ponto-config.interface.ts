export interface PontoConfig{
  userOnboardUrl: string,
  ibanity: {
    appId: string
    clientId: string,
    clientSecret: string,

    signature_private_key_id: string,
    signature_certificate_path: string,
    signature_key_path: string,
    signature_passphrase: string,

    certificate_path: string,
    key_path: string,
    passphrase: string,
    apiEndpoint: string,
    onboardingEndpoint: string,
    reauthorizeAccountEndpoint: string
  }
}
export interface OnboardingDetailsObj
{
  type: 'onboardingDetails',
  id?: string,
  attributes: {
    vatNumber?: string,
    phoneNumber: string,
    organizationName: string,
    lastName: string,
    firstName: string,
    enterpriseNumber: string,
    email: string,
    addressStreetAddress: string,
    addressPostalCode: string,
    addressCountry: string,
    addressCity: string
  }
}

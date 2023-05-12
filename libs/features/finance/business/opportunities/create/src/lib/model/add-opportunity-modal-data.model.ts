import { Company } from "@app/model/finance/companies";
import { Contact } from "@app/model/finance/contacts";

/** Data passed to add-opportunity-modal. */
export interface AddOpportunityModalData
{
  contact?: Contact;
  company?: Company;
}
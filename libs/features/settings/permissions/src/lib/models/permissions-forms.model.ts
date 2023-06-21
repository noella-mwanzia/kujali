import { FormBuilder } from '@angular/forms';

export function __CreatePermissionsMainForm(_fb: FormBuilder) {
  return _fb.group(
    {
      GeneralSettings: _fb.group({
        CanAddNewMember: _fb.group({}),
        CanDeleteMember: _fb.group({}),
        CanViewDetailView: _fb.group({}),
      }),
      CompanySettings: _fb.group({
        CanViewCompanies: _fb.group({}),
        CanCreateCompanies: _fb.group({}),
        CanEditCompanies: _fb.group({}),
        CanEditCompanyActions: _fb.group({}),
        CanDeleteCompanies: _fb.group({}),
        CanViewCompanyActions: _fb.group({}),
        CanCreateCompanyActions: _fb.group({}),
        CanDeleteCompanyActions: _fb.group({}),
      }),
      ContactsSettings: _fb.group({
        CanViewContacts: _fb.group({}),
        CanCreateContacts: _fb.group({}),
        CanEditContacts: _fb.group({}),
        CanEditContactActions: _fb.group({}),
        CanDeleteContacts: _fb.group({}),
        CanViewContactsActions: _fb.group({}),
        CanCreateContactsActions: _fb.group({}),
        CanDeleteContactsActions: _fb.group({}),
      }),
      OpportunitiesSettings: _fb.group({
        CanViewOpportunities: _fb.group({}),
        CanCreateOpportunities: _fb.group({}),
        CanEditOpportunities: _fb.group({}),
        CanEditOpportunitiesActions: _fb.group({}),
        CanDeleteOpportunities: _fb.group({}),
        CanViewOpportunitiesActions: _fb.group({}),
        CanCreateOpportunitiesActions: _fb.group({}),
        CanDeleteOpportunitiesActions: _fb.group({}),
      }),
      InvoicesSettings: _fb.group({
        CanViewInvoices: _fb.group({}),
        CanCreateInvoices: _fb.group({}),
        CanEditInvoices: _fb.group({}),
        CanDeleteInvoices: _fb.group({}),
        CanSendInvoice: _fb.group({})
      }),
      QuotesSettings: _fb.group({
        CanViewQuotes: _fb.group({}),
        CanCreateQuotes: _fb.group({}),
        CanEditQuotes: _fb.group({}),
        CanSendQuotes: _fb.group({}),
        CanDeleteQuotes: _fb.group({}),
      }),
      OrdersSettings: _fb.group({
        CanViewOrders: _fb.group({}),
        CanCreateOrders: _fb.group({}),
        CanEditOrders: _fb.group({}),
        CanDeleteOrders: _fb.group({}),
      }),
    },
    {}
  );
}

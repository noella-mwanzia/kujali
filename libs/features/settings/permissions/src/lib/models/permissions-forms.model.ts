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
      AccountsSettings:  _fb.group({
        CanViewAccounts: _fb.group({}),
        CanCreateAccounts: _fb.group({}),
        CanEditAccounts: _fb.group({}),
        CanEditAccountsActions: _fb.group({}),
        CanDeleteAccounts: _fb.group({}),
        CanViewAccountsActions: _fb.group({}),
        CanCreateAccountsActions: _fb.group({}),
        CanDeleteAccountsActions: _fb.group({})
      }),
      PaymentsSettings: _fb.group({
        CanViewPayments: _fb.group({}),
        CanCreatePayments: _fb.group({}),
        CanEditPayments: _fb.group({}),
        CanEditPaymentsActions: _fb.group({}),
        CanDeletePayments: _fb.group({}),
        CanViewPaymentsActions: _fb.group({}),
        CanCreatePaymentsActions: _fb.group({}),
        CanDeletePaymentsActions: _fb.group({})
      }),
      ExpensesSettings: _fb.group({
        CanViewExpenses: _fb.group({}),
        CanCreateExpenses: _fb.group({}),
        CanEditExpenses: _fb.group({}),
        CanEditExpensesActions: _fb.group({}),
        CanDeleteExpenses: _fb.group({}),
        CanViewExpensesActions: _fb.group({}),
        CanCreateExpensesActions: _fb.group({}),
        CanDeleteExpensesActions: _fb.group({})
      }),
      BudgetsSettings: _fb.group({
        CanViewBudgets: _fb.group({}),
        CanCreateBudgets: _fb.group({}),
        CanEditBudgets: _fb.group({}),
        CanEditBudgetsActions: _fb.group({}),
        CanDeleteBudgets: _fb.group({}),
        CanViewBudgetsActions: _fb.group({}),
        CanCreateBudgetsActions: _fb.group({}),
        CanDeleteBudgetsActions: _fb.group({})
      }),
    },{}
  );
}

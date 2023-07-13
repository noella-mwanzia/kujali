
import { IObject } from "@iote/bricks"
import { KuUserRoles } from "@app/model/common/user"

export interface KujaliPermissions extends IObject
{
  access: boolean,

  GeneralSettings: {
    CanAddNewMember: KujaliFeaturePermission,
    CanDeleteMember: KujaliFeaturePermission,
  },
  CompanySettings: {
    CanViewCompanies: KujaliFeaturePermission,
    CanCreateCompanies: KujaliFeaturePermission,
    CanEditCompanies: KujaliFeaturePermission,
    CanEditCompanyActions: KujaliFeaturePermission,
    CanDeleteCompanies: KujaliFeaturePermission,
    CanViewCompanyActions: KujaliFeaturePermission,
    CanCreateCompanyActions: KujaliFeaturePermission,
    CanDeleteCompanyActions: KujaliFeaturePermission
  },
  ContactsSettings: {
    CanViewContacts: KujaliFeaturePermission,
    CanCreateContacts: KujaliFeaturePermission,
    CanEditContacts: KujaliFeaturePermission,
    CanEditContactActions: KujaliFeaturePermission,
    CanDeleteContacts: KujaliFeaturePermission,
    CanViewContactsActions: KujaliFeaturePermission,
    CanCreateContactsActions: KujaliFeaturePermission,
    CanDeleteContactsActions: KujaliFeaturePermission
  },
  OpportunitiesSettings: {
    CanViewOpportunities: KujaliFeaturePermission,
    CanCreateOpportunities: KujaliFeaturePermission,
    CanEditOpportunities: KujaliFeaturePermission,
    CanEditOpportunitiesActions: KujaliFeaturePermission,
    CanDeleteOpportunities: KujaliFeaturePermission,
    CanViewOpportunitiesActions: KujaliFeaturePermission,
    CanCreateOpportunitiesActions: KujaliFeaturePermission,
    CanDeleteOpportunitiesActions: KujaliFeaturePermission
  },
  InvoicesSettings: {
    CanViewInvoices: KujaliFeaturePermission,
    CanCreateInvoices: KujaliFeaturePermission,
    CanEditInvoices: KujaliFeaturePermission,
    CanDeleteInvoices: KujaliFeaturePermission,
    CanSendInvoice: KujaliFeaturePermission
  },
  AccountsSettings: {
    CanViewAccounts: KujaliFeaturePermission,
    CanCreateAccounts: KujaliFeaturePermission,
    CanEditAccounts: KujaliFeaturePermission,
    CanEditAccountsActions: KujaliFeaturePermission,
    CanDeleteAccounts: KujaliFeaturePermission,
    CanViewAccountsActions: KujaliFeaturePermission,
    CanCreateAccountsActions: KujaliFeaturePermission,
    CanDeleteAccountsActions: KujaliFeaturePermission
  },
  PaymentsSettings: {
    CanViewPayments: KujaliFeaturePermission,
    CanCreatePayments: KujaliFeaturePermission,
    CanEditPayments: KujaliFeaturePermission,
    CanEditPaymentsActions: KujaliFeaturePermission,
    CanDeletePayments: KujaliFeaturePermission,
    CanViewPaymentsActions: KujaliFeaturePermission,
    CanCreatePaymentsActions: KujaliFeaturePermission,
    CanDeletePaymentsActions: KujaliFeaturePermission
  },
  ExpensesSettings: {
    CanViewExpenses: KujaliFeaturePermission,
    CanCreateExpenses: KujaliFeaturePermission,
    CanEditExpenses: KujaliFeaturePermission,
    CanEditExpensesActions: KujaliFeaturePermission,
    CanDeleteExpenses: KujaliFeaturePermission,
    CanViewExpensesActions: KujaliFeaturePermission,
    CanCreateExpensesActions: KujaliFeaturePermission,
    CanDeleteExpensesActions: KujaliFeaturePermission
  },
  BudgetsSettings: {
    CanViewBudgets: KujaliFeaturePermission,
    CanCreateBudgets: KujaliFeaturePermission,
    CanEditBudgets: KujaliFeaturePermission,
    CanEditBudgetsActions: KujaliFeaturePermission,
    CanDeleteBudgets: KujaliFeaturePermission,
    CanViewBudgetsActions: KujaliFeaturePermission,
    CanCreateBudgetsActions: KujaliFeaturePermission,
    CanDeleteBudgetsActions: KujaliFeaturePermission
  },
}

/** Permission setting on a single feature/claim/.. */
export interface KujaliFeaturePermission extends KuUserRoles {}
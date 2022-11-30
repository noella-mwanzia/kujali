// THIS FILE CONTAINS THE COST-TYPES SEED FOR EACH ORGANISATION, I.E. THE DEFAULT COST TYPES EACH ORG START WITH.

import { BudgetRowType } from "../budget-row-type.enum";
import { LoadedTransactionType, LoadedTransactionTypeCategory } from "../select-transaction-type-model";
import { TransactionTypeCategory } from "../transaction-type-category.interface";

// INCOME 1. COST OF SALES
const INC_SLS            = { id: 'i1', name: 'INCOME-TYPES.SALES.MAIN', order: 1, type: BudgetRowType.IncomeLine } as LoadedTransactionType;
const INC_SLS_SALES      = { id: 'i11',  name: 'INCOME-TYPES.SALES.GOODS',      categoryId: 'i1', category: INC_SLS,  order: 1,  type: BudgetRowType.IncomeLine } as LoadedTransactionType;
const INC_SLS_CONSULTSLS = { id: 'i12',  name: 'INCOME-TYPES.SALES.CONSULTING', categoryId: 'i1', category: INC_SLS,  order: 2,  type: BudgetRowType.IncomeLine } as LoadedTransactionType;
const INC_SLS_ROYALTY    = { id: 'i13',  name: 'INCOME-TYPES.SALES.ROYALTIES',  categoryId: 'i1', category: INC_SLS,  order: 3,  type: BudgetRowType.IncomeLine } as LoadedTransactionType;
const INC_SLS_MISC       = { id: 'i199', name: 'INCOME-TYPES.SALES.MISC',       categoryId: 'i1', category: INC_SLS,  order: 99, type: BudgetRowType.IncomeLine } as LoadedTransactionType;

const LDED_INC_SLS = <unknown> INC_SLS as LoadedTransactionTypeCategory;
LDED_INC_SLS.types = [INC_SLS_SALES, INC_SLS_CONSULTSLS, INC_SLS_ROYALTY, INC_SLS_MISC];

// INCOME 1. INVESTMENTS
const INC_INV         = { id: 'i2', name: 'INCOME-TYPES.INVS.MAIN', order: 1, type: BudgetRowType.IncomeLine } as LoadedTransactionType;
const INC_INV_EQUITY  = { id: 'i21',  name: 'INCOME-TYPES.INVS.EQUITY',     categoryId: 'i1', category: INC_INV,  order: 1,  type: BudgetRowType.IncomeLine } as LoadedTransactionType;
const INC_INV_DEBT    = { id: 'i22',  name: 'INCOME-TYPES.INVS.CONSULTING', categoryId: 'i1', category: INC_INV,  order: 2,  type: BudgetRowType.IncomeLine } as LoadedTransactionType;
const INC_INV_MISC    = { id: 'i299', name: 'INCOME-TYPES.INVS.MISC',       categoryId: 'i1', category: INC_INV,  order: 3,  type: BudgetRowType.IncomeLine } as LoadedTransactionType;

const LDED_INC_INV = <unknown> INC_INV as LoadedTransactionTypeCategory;
LDED_INC_INV.types = [INC_INV_EQUITY, INC_INV_DEBT, INC_INV_MISC];

//
//  COSTS
//

// COSTS 1. COST OF SALES
const COST_COS            = { id: 'c1', name: 'COST-TYPES.COS.MAIN', order: 1, type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_COS_SALES      = { id: 'c11',   name: 'COST-TYPES.COS.SALES',     categoryId: 'c1', category: COST_COS,  order: 1,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_COS_MATERIALS  = { id: 'c12',   name: 'COST-TYPES.COS.MATERIALS', categoryId: 'c1', category: COST_COS,  order: 2,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_COS_STAFF      = { id: 'c13',   name: 'COST-TYPES.COS.STAFF',     categoryId: 'c1', category: COST_COS,  order: 3,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_COS_MISC       = { id: 'c199',  name: 'COST-TYPES.COS.MISC',      categoryId: 'c1', category: COST_COS,  order: 99, type: BudgetRowType.CostLine } as LoadedTransactionType;

const LDED_COST_COS = <unknown> COST_COS as LoadedTransactionTypeCategory;
LDED_COST_COS.types = [COST_COS_SALES, COST_COS_MATERIALS, COST_COS_STAFF, COST_COS_MISC];

// COSTS 2. EXPENSES
const COST_EXPENSES       = { id: 'c2', name: 'COST-TYPES.EXP.MAIN', order: 1, type: BudgetRowType.CostLine } as TransactionTypeCategory;
const COST_EXP_PAYROLL    = { id: 'c21',  name: 'COST-TYPES.EXP.PAYROLL',   categoryId: 'c2', category: COST_EXPENSES,  order: 1,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_EXP_OFFICE     = { id: 'c22',  name: 'COST-TYPES.EXP.OFFICE',    categoryId: 'c2', category: COST_EXPENSES,  order: 2,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_EXP_MATERIALS  = { id: 'c23',  name: 'COST-TYPES.EXP.MATERIALS', categoryId: 'c2', category: COST_EXPENSES,  order: 3,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_EXP_RENTS      = { id: 'c24',  name: 'COST-TYPES.EXP.RENTS',     categoryId: 'c2', category: COST_EXPENSES,  order: 4,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_EXP_ADMIN      = { id: 'c25',  name: 'COST-TYPES.EXP.ADMIN',     categoryId: 'c2', category: COST_EXPENSES,  order: 5,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_EXP_LEGAL      = { id: 'c26',  name: 'COST-TYPES.EXP.LEGAL',     categoryId: 'c2', category: COST_EXPENSES,  order: 6,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_EXP_FINANCE    = { id: 'c27',  name: 'COST-TYPES.EXP.FINANCE',   categoryId: 'c2', category: COST_EXPENSES,  order: 7,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_EXP_FLEET      = { id: 'c28',  name: 'COST-TYPES.EXP.FLEET',     categoryId: 'c2', category: COST_EXPENSES,  order: 8,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_EXP_MISC       = { id: 'c299', name: 'COST-TYPES.EXP.MISC',      categoryId: 'c2', category: COST_EXPENSES,  order: 99, type: BudgetRowType.CostLine } as LoadedTransactionType;

const LDED_COST_EXP = <unknown> COST_EXPENSES as LoadedTransactionTypeCategory;
LDED_COST_EXP.types = [COST_EXP_PAYROLL, COST_EXP_OFFICE, COST_EXP_MATERIALS, COST_EXP_RENTS, COST_EXP_ADMIN, COST_EXP_LEGAL,
                        COST_EXP_FINANCE, COST_EXP_FLEET, COST_EXP_MISC];

// COSTS 3. INVESTMENTS
const COST_INVESTMENTS     = { id: 'c3', name: 'COST-TYPES.INVST.MAIN', order: 1, type: BudgetRowType.CostLine } as TransactionTypeCategory;
const COST_INVST_FLEET     = { id: 'c31',  name: 'COST-TYPES.INVST.FLEET',     categoryId: 'c3', category: COST_INVESTMENTS,  order: 1,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_INVST_EQUIPMENT = { id: 'c32',  name: 'COST-TYPES.INVST.EQUIPMENT', categoryId: 'c3', category: COST_INVESTMENTS,  order: 2,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_INVST_FINANCE   = { id: 'c32',  name: 'COST-TYPES.INVST.FINANCE',   categoryId: 'c3', category: COST_INVESTMENTS,  order: 3,  type: BudgetRowType.CostLine } as LoadedTransactionType;
// const CONST_STAFF_PAYROLL   = { id: 'c34',  name: 'COST-TYPES.INVST.MISC',      categoryId: 'c3', category: COST_INVESTMENTS,  order: 4,  type: BudgetRowType.CostLine } as LoadedTransactionType;
const COST_INVST_MISC      = { id: 'c399', name: 'COST-TYPES.INVST.MISC',      categoryId: 'c3', category: COST_INVESTMENTS,  order: 99, type: BudgetRowType.CostLine } as LoadedTransactionType;

const LDED_COST_INVST = <unknown> COST_INVESTMENTS as LoadedTransactionTypeCategory;
LDED_COST_INVST.types = [COST_INVST_FLEET, COST_INVST_EQUIPMENT, COST_INVST_FINANCE, COST_INVST_MISC];

/**
 * The list of all initially supported cost types on an organisation.
 * 
 * TODO: Allow dynamic modification and add/edit/delete
 */
export const DEFAULT_COST_CATEGORIES: LoadedTransactionTypeCategory[] = 
[
  LDED_INC_SLS,
  LDED_INC_INV,

  LDED_COST_COS,
  LDED_COST_EXP,
  LDED_COST_INVST,
] 

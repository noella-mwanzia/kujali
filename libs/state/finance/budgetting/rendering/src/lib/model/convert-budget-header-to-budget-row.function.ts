import { AmountPerMonth, AmountPerYear,
         BudgetHeaderResult, BudgetRow } from "@app/model/finance/planning/budget-lines";

/**
 * takes a budget header result and converts it
 * to a budget row
 * @param header 
 * @returns a budget row
 */

export function CreateBudgetRow(header: BudgetHeaderResult): BudgetRow {

  let row : BudgetRow = {
    name: header.name,
    type: '',
    amountsYear: [],
  }

  Object.keys(header.headers).forEach((year, index) => {

    let monthAmounts = header.headers[year];
    let yearAmount: AmountPerYear = {
      year: Number(year),
      amountsMonth: [],
      total: 0
    }

    let total = 0;
    monthAmounts.forEach((month: number, index: number) => {
      let monthRow : AmountPerMonth = {
        amount: 0,
        baseAmount: 0,
        units: 0
      }

      monthRow.amount = header.headers[year][index];
      monthRow.baseAmount = 0;
      monthRow.units = 0;

      total = total + header.headers[year][index];
      yearAmount.amountsMonth.push(monthRow);
      yearAmount.total = total;
    })

    row.amountsYear.push(yearAmount);
  })

  return row;
 }
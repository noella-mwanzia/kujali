import * as XLSX from 'xlsx';

import { Observable } from "rxjs";
import { Logger } from '@elewa/angular-bricks';

const HEADERS = { header: ['Category', 'Name', "January", "February", "March", "April", 
                            "May", "June", "July", "August", "September", "October", 
                            "November", "December"]}; 

const BALANCE_HEADERS = { header: ['Category', "January", "February", "March", "April", 
                            "May", "June", "July", "August", "September", "October", 
                            "November", "December"]}; 

export class ExcelExporterModel
{
  constructor(private _logger: Logger) { }

  exportToExcel(balanceSheet, costSheet, incomeSheet) {
    const balanceWs = XLSX.utils.json_to_sheet(balanceSheet, BALANCE_HEADERS);
    const costWs = XLSX.utils.json_to_sheet(costSheet, HEADERS);
    const incomeWs = XLSX.utils.json_to_sheet(incomeSheet, HEADERS);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, balanceWs, 'Balance');
    XLSX.utils.book_append_sheet(wb, costWs, 'Cost');
    XLSX.utils.book_append_sheet(wb, incomeWs, 'Income');

    /* save to file */
    XLSX.writeFile(wb, 'Budget.xlsx');

    this._logger.log(() => 'An excel file was downloaded'); 

  }

  //  private _getExcelData() {
  //   this.balanceExcelData = this._generateExcelData(this.balanceTable, this.balance);
  //   this.costExcelData = this._generateExcelData(this.costDataSource, this.costTotal);
  //   this.incomeExcelData = this._generateExcelData(this.incomeDataSource, this.incomeTotal);
  // }


  // downloadExcelFile() {
  //   const balanceExcelDataForYear = this._generateExcelDataForYear(this.balanceExcelData, this.year);
  //   const costExcelDataForYear = this._generateExcelDataForYear(this.costExcelData, this.year);
  //   const incomeExcelDataForYear = this._generateExcelDataForYear(this.incomeExcelData, this.year);

  //   this._excelExportService.exportToExcel(balanceExcelDataForYear, costExcelDataForYear, incomeExcelDataForYear);
  // }

  private _generateExcelData(source: Observable<any>, total: Observable<any>)
  {
    let reqData = { dataList: [], total: {} };

    source.subscribe(dataList => {
      reqData.dataList = dataList;
    });

    total.subscribe(total => {
      reqData.total = total;
    });

    return reqData;
  }


  // private _generateExcelDataForYear(excelData, year) {
  //   let body = [];
  //   let totalData = { Category: 'Total', Name: '' };

  //   // For the body data - cell rows that aren't the total
  //   excelData.dataList.forEach(data => {
  //     let res = { Category: data.name, Name: data.isHeader ? '' : data.name };

  //     for (let i = 0; i < data.amountByYearAndMonth[this.years.indexOf(year)].amountPerMonth.length; i++) {
  //       res[this.months[i].name] = data.amountByYearAndMonth[this.years.indexOf(this.year)].amountPerMonth[i].amount;
  //     }

  //     body.push(res);
  //   });

  //   // For the totals
  //   for (let i = 0; i < excelData.total.amountByYearAndMonth[this.years.indexOf(year)].amountPerMonth.length; i++) {
  //     totalData[this.months[i].name] = excelData.total.amountByYearAndMonth[this.years.indexOf(this.year)].amountPerMonth[i].amount;
  //   }

  //   body.push(totalData);

  //   return body;
  // }
}

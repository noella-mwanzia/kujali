import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';

@Injectable({
  providedIn: 'root'
})
export class TransactionPlanService {

  constructor() { }

  createTransactionPlan(transacitonForm: FormGroup, budgetId: string, mode: 1 | -1, isEdit: boolean): TransactionPlan {
    let formvalues = transacitonForm.getRawValue();

    let transaction = { ...formvalues.pTNameFormGroup, ...formvalues.pTValueBaseFormGroup,
                        ...formvalues.pTOccurenceFormGroup, ...formvalues.pTIncreaseFormGroup
    }

    let transacitonPlan = {
      
      orgId: '',
      budgetId: budgetId,
      amount: transaction.amount,
      units: transaction.units,
      fromYear: transaction.fromYear,
      fromMonth: transaction.fromMonth,
      frequency: transaction.frequency,
      xTimesInterval: transaction.xTimesInterval,
      king: isEdit && transaction.king ? true : false,
      lineName: transaction.lineName,
      mode: mode,
      lineId : transaction.lineId,
      id: transaction.id,
      trTypeId: transaction.type.id ? transaction.type.id : transaction.type,
      trCatId: transaction.category.id ? transaction.category.id : transaction.category,

      hasIncrease: transaction.hasIncrease,

      amntIncrConfig : {
        incrStyle: transaction.amntIncrConfig,
        incrFreq: transaction.amountIncreaseFrequency,
        incrRate: transaction.amountIncreaseRate,
        interval: transaction.xTimesAmountIncreaseInterval 
      },

      unitIncrConfig : {
        incrStyle: transaction.unitIncrConfig,
        incrFreq: transaction.unitIncreaseFrequency,
        incrRate: transaction.unitIncreaseRate,
        interval: transaction.xTimesUnitIncreaseInterval 
      }
    } as TransactionPlan

    return transacitonPlan;
  }
}
